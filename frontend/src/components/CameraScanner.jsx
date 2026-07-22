import { useEffect, useRef, useState } from 'react';
import { X, Camera as CameraIcon } from 'lucide-react';

export default function CameraScanner({ onClose, onContinue }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [status, setStatus] = useState('scanning'); // scanning, analyzing, result
  const [aiResult, setAiResult] = useState('');

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Erro ao acessar a câmera:", err);
      }
    }
    
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    setStatus('analyzing');
    // Simulate AI processing time
    setTimeout(() => {
      setStatus('result');
      setAiResult('Visita Técnica'); // Fake AI result for now
    }, 3000);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: '#000',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      color: 'white'
    }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem', zIndex: 10 }}>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
          <X size={32} />
        </button>
        <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Escaneamento IA</div>
        <div style={{ width: '32px' }}></div>
      </div>

      {status === 'scanning' && (
        <>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            style={{ 
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 
            }} 
          />

          {/* Scanner Overlay UI */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.5)',
          }}>
            <div style={{
               width: '80%', height: '55%', position: 'relative',
               boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)', 
               borderRadius: '16px', border: '2px solid rgba(255,255,255,0.2)',
               overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}>
               {/* Corners */}
               <div className="scanner-corner top-left"></div>
               <div className="scanner-corner top-right"></div>
               <div className="scanner-corner bottom-left"></div>
               <div className="scanner-corner bottom-right"></div>

               {/* Scanning Line */}
               <div className="scanner-line"></div>
               
               <p style={{ opacity: 0.6, fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
                 Posicione o documento ou texto na área demarcada.
               </p>
            </div>
          </div>

          {/* Capture Button */}
          <div style={{
            position: 'absolute', bottom: '2rem', left: 0, right: 0,
            display: 'flex', justifyContent: 'center', zIndex: 10
          }}>
            <button onClick={handleCapture} style={{
              width: '75px', height: '75px', borderRadius: '50%',
              backgroundColor: 'var(--primary-blue)', border: '4px solid white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
            }}>
              <CameraIcon size={36} color="white" />
            </button>
          </div>
        </>
      )}

      {status === 'analyzing' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, backgroundColor: 'var(--secondary-blue)' }}>
           <div className="spinner" style={{ marginBottom: '2rem' }}></div>
           <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Analisando documento...</h3>
           <p style={{ opacity: 0.8, marginTop: '0.5rem', textAlign: 'center', padding: '0 2rem' }}>
             A Inteligência Artificial está interpretando os dados capturados.
           </p>
        </div>
      )}

      {status === 'result' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', padding: '2rem' }}>
           <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
           </div>
           <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--secondary-blue)', marginBottom: '0.5rem' }}>Sucesso!</h3>
           <p style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1rem', color: '#6B7280' }}>
             O documento foi identificado automaticamente como:<br/>
             <strong style={{ color: 'var(--primary-blue)', fontSize: '1.3rem', display: 'block', marginTop: '0.5rem' }}>{aiResult}</strong>
           </p>

           <button 
             onClick={() => onContinue(aiResult)} 
             style={{
               width: '100%', padding: '1.2rem', borderRadius: '12px',
               backgroundColor: 'var(--primary-blue)', color: 'white', border: 'none',
               fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer',
               boxShadow: '0 4px 10px rgba(66, 133, 244, 0.3)'
             }}
           >
             Continuar para Edição
           </button>
        </div>
      )}

    </div>
  );
}
