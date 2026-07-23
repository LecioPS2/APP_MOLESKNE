import { useEffect, useState, useRef } from 'react';
import { X, Mic, MicOff, Check, Square } from 'lucide-react';

export default function VoiceAssistant({ onClose }) {
  const [aiText, setAiText] = useState('Toque no microfone para iniciar. Fale no seu tempo, depois toque em Parar.');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState('');
  const [data, setData] = useState({ category: 'Anotação', date: '', location: '', participants: '', text: '' });
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setAiText('Estou ouvindo... Pode falar pausadamente. Toque no quadrado para parar.');
      };

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }
        setFinalTranscript(currentTranscript.trim());
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === 'no-speech' || event.error === 'audio-capture') {
          // Ignore timeouts
        } else {
          setIsListening(false);
          setAiText('Houve um problema ao ouvir. Tente novamente.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleToggleMic = () => {
    if (!recognitionRef.current) {
      alert('Seu navegador não suporta reconhecimento de voz.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      processText(finalTranscript);
    } else {
      setFinalTranscript('');
      recognitionRef.current.start();
    }
  };

  const processText = async (transcript) => {
    if (!transcript) {
      setAiText('Não ouvi nada. Tente novamente.');
      return;
    }
    setIsProcessing(true);
    setAiText('Analisando sua fala usando IA...');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/ai/parse-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: transcript })
      });

      if (!res.ok) throw new Error('Falha ao processar texto com IA');
      
      const parsedData = await res.json();
      
      setData({ 
        category: parsedData.category || 'Anotação', 
        text: parsedData.text || transcript, 
        date: parsedData.date || '', 
        location: parsedData.location || '', 
        participants: parsedData.participants || '' 
      });
      
      setIsProcessing(false);
      setIsDone(true);
      setAiText('Tudo pronto! Posso salvar sua anotação?');
    } catch (err) {
      console.error(err);
      // Fallback if AI fails
      setData({ category: 'Anotação', text: transcript, date: '', location: '', participants: '' });
      setIsProcessing(false);
      setIsDone(true);
      setAiText('Pronto! Verifique os dados abaixo.');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      
      if (!res.ok) throw new Error('Falha ao salvar anotação via voz');
      
      alert('Anotação via Voz salva com sucesso!');
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-transition" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'linear-gradient(135deg, #1D2671 0%, #313679 100%)',
      zIndex: 9999, display: 'flex', flexDirection: 'column', color: 'white'
    }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem', zIndex: 10 }}>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
          <X size={32} />
        </button>
        <div style={{ fontWeight: 600, fontSize: '1.1rem', opacity: 0.8 }}>IA Assistente</div>
        <div style={{ width: '32px' }}></div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
        
        {/* AI Text Question */}
        <h2 style={{ fontSize: '1.8rem', fontWeight: 600, lineHeight: '1.4', marginBottom: '3rem', minHeight: '80px', transition: 'all 0.3s ease' }}>
          {aiText}
        </h2>

        {/* Dynamic Display of gathered data so far */}
        {isDone && (
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '16px', width: '100%', maxWidth: '350px', marginBottom: '3rem', textAlign: 'left', backdropFilter: 'blur(10px)' }}>
             <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}><span style={{ opacity: 0.6 }}>Categoria:</span> <strong style={{color: '#93C5FD'}}>{data.category}</strong></p>
             {data.date && <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}><span style={{ opacity: 0.6 }}>Data sugerida:</span> <strong style={{color: '#93C5FD'}}>{data.date}</strong></p>}
             <p style={{ margin: 0, fontSize: '0.9rem' }}><span style={{ opacity: 0.6 }}>Transcrição:</span> <strong style={{color: '#93C5FD'}}>{data.text}</strong></p>
          </div>
        )}

        {/* Transcription Preview (while listening) */}
        {!isDone && finalTranscript && (
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', width: '100%', maxWidth: '350px', marginBottom: '2rem', textAlign: 'left', minHeight: '60px' }}>
            <p style={{ margin: 0, fontSize: '0.95rem', fontStyle: 'italic', color: '#E5E7EB' }}>"{finalTranscript}"</p>
          </div>
        )}

        {/* Mic / Action Button */}
        {!isDone ? (
          <div style={{ position: 'relative' }}>
            {/* Animated Rings if listening */}
            {isListening && (
              <>
                <div style={{ position: 'absolute', top: '-20px', left: '-20px', right: '-20px', bottom: '-20px', border: '2px solid rgba(16, 185, 129, 0.4)', borderRadius: '50%', animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }}></div>
                <div style={{ position: 'absolute', top: '-40px', left: '-40px', right: '-40px', bottom: '-40px', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '50%', animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite 0.5s' }}></div>
              </>
            )}

            <button 
              onClick={handleToggleMic}
              disabled={isProcessing}
              style={{
                width: '80px', height: '80px', borderRadius: '50%',
                backgroundColor: isProcessing ? '#4B5563' : (isListening ? '#EF4444' : 'var(--primary-blue)'), 
                border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                position: 'relative', zIndex: 2, transition: 'all 0.3s ease'
              }}>
              {isProcessing ? (
                <div className="spinner" style={{ width: '30px', height: '30px', borderWidth: '3px' }}></div>
              ) : isListening ? (
                <Square size={28} fill="white" />
              ) : (
                <Mic size={36} />
              )}
            </button>
            <p style={{ marginTop: '1.5rem', opacity: 0.7, fontSize: '0.9rem' }}>
               {isProcessing ? 'Processando fala...' : (isListening ? 'Toque no quadrado para parar' : 'Toque no microfone para iniciar')}
            </p>
          </div>
        ) : (
          <button 
            onClick={handleSave}
            disabled={loading}
            style={{
              width: '100%', maxWidth: '300px', padding: '1.2rem', borderRadius: '16px',
              backgroundColor: loading ? '#4B5563' : '#10B981', color: 'white', border: 'none',
              fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem',
              boxShadow: loading ? 'none' : '0 10px 25px rgba(16, 185, 129, 0.3)'
            }}>
            <Check size={24} /> {loading ? 'Salvando...' : 'Confirmar e Salvar'}
          </button>
        )}

      </div>
    </div>
  );
}
