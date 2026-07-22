import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import CameraScanner from '../components/CameraScanner';
import ManualCreate from '../components/ManualCreate';
import VoiceAssistant from '../components/VoiceAssistant';
import { useState } from 'react';

export default function CreateAction() {
  const [isScanning, setIsScanning] = useState(false);
  const [isManualCreating, setIsManualCreating] = useState(false);
  const [isVoiceAssistant, setIsVoiceAssistant] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  const handleScannerContinue = (data) => {
    setIsScanning(false);
    setScannedData(data);
    setIsManualCreating(true);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)', minHeight: '100vh', position: 'relative' }}>
      <Header />

      <main className="page-transition" style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', flex: 1, paddingBottom: '120px' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--secondary-blue)', marginBottom: '1.5rem' }}>
          Criar Nova Tarefa, Reunião ou VT.
        </h2>

        {/* Captura de Imagem Button */}
        <button 
          onClick={() => setIsScanning(true)}
          style={{ 
            backgroundColor: 'var(--primary-blue)', 
            color: 'white',
            padding: '2rem 1.5rem', 
            borderRadius: '16px',
            border: '2px solid #111',
            display: 'flex',
            alignItems: 'center',
            fontSize: '1.15rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
          }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid white', marginRight: '1.5rem' }}></div>
          Captura de Imagem
        </button>

        {/* Criar por Voz com IA Button */}
        <button 
          onClick={() => setIsVoiceAssistant(true)}
          style={{ 
            backgroundColor: 'var(--secondary-blue)', 
            color: 'white',
            padding: '2rem 1.5rem', 
            borderRadius: '16px',
            border: '2px solid #111',
            display: 'flex',
            alignItems: 'center',
            fontSize: '1.15rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
          }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid white', marginRight: '1.5rem' }}></div>
          Criar por Voz com IA
        </button>

        {/* Criar Manualmente Button */}
        <button 
          onClick={() => setIsManualCreating(true)}
          style={{ 
            backgroundColor: '#B05A58', 
            color: 'white',
            padding: '2rem 1.5rem', 
            borderRadius: '16px',
            border: '2px solid #111',
            display: 'flex',
            alignItems: 'center',
            fontSize: '1.15rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
          }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid white', marginRight: '1.5rem' }}></div>
          Criar Manualmente
        </button>

      </main>

      <BottomNav activeTab="create" />

      {/* Render overlays */}
      {isScanning && <CameraScanner onClose={() => setIsScanning(false)} onContinue={handleScannerContinue} />}
      {isVoiceAssistant && <VoiceAssistant onClose={() => setIsVoiceAssistant(false)} />}
      {isManualCreating && <ManualCreate onClose={() => setIsManualCreating(false)} initialData={scannedData} />}
    </div>
  );
}
