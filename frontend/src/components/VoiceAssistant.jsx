import { useEffect, useState } from 'react';
import { X, Mic, Check } from 'lucide-react';

export default function VoiceAssistant({ onClose }) {
  const [aiText, setAiText] = useState('Toque no microfone e fale tudo de uma vez. A IA vai interpretar seu áudio.');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [data, setData] = useState({ category: 'Anotação', date: '', location: '', participants: '', text: '' });

  const handleMicClick = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Seu navegador não suporta reconhecimento de voz.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setAiText('Estou ouvindo... Pode falar!');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      setIsProcessing(true);
      setAiText('Processando...');

      // Smart Parser
      setTimeout(() => {
        let category = 'Anotação';
        const lowerText = transcript.toLowerCase();
        
        if (lowerText.includes('reunião') || lowerText.includes('reuniao')) category = 'Reunião';
        else if (lowerText.includes('visita') || lowerText.includes('técnica')) category = 'Visita Técnica';
        else if (lowerText.includes('rascunho')) category = 'Rascunho';

        // Try basic date extraction (e.g. 25/10 or 25 de outubro)
        const dateMatch = transcript.match(/(\d{1,2})[\/\-](\d{1,2})/);
        let parsedDate = '';
        if (dateMatch) {
          const d = dateMatch[1].padStart(2, '0');
          const m = dateMatch[2].padStart(2, '0');
          parsedDate = `${new Date().getFullYear()}-${m}-${d}T12:00`;
        }

        setData({ category, text: transcript, date: parsedDate, location: '', participants: '' });
        setIsProcessing(false);
        setIsDone(true);
        setAiText('Tudo pronto! Posso salvar sua anotação?');
      }, 1000);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setAiText('Não consegui ouvir bem. Tente novamente.');
    };

    recognition.start();
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

        {/* Mic / Action Button */}
        {!isDone ? (
          <div style={{ position: 'relative' }}>
            {/* Animated Rings if listening */}
            {isListening && (
              <>
                <div style={{ position: 'absolute', top: '-20px', left: '-20px', right: '-20px', bottom: '-20px', border: '2px solid rgba(66, 133, 244, 0.4)', borderRadius: '50%', animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }}></div>
                <div style={{ position: 'absolute', top: '-40px', left: '-40px', right: '-40px', bottom: '-40px', border: '1px solid rgba(66, 133, 244, 0.2)', borderRadius: '50%', animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite 0.5s' }}></div>
              </>
            )}

            <button 
              onClick={handleMicClick}
              disabled={isListening || isProcessing}
              style={{
                width: '80px', height: '80px', borderRadius: '50%',
                backgroundColor: isProcessing ? '#4B5563' : (isListening ? '#10B981' : 'var(--primary-blue)'), 
                border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                position: 'relative', zIndex: 2, transition: 'all 0.3s ease'
              }}>
              {isProcessing ? (
                <div className="spinner" style={{ width: '30px', height: '30px', borderWidth: '3px' }}></div>
              ) : (
                <Mic size={36} />
              )}
            </button>
            <p style={{ marginTop: '1.5rem', opacity: 0.7, fontSize: '0.9rem' }}>
               {isProcessing ? 'Processando fala...' : (isListening ? 'Fale agora...' : 'Toque para falar')}
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
