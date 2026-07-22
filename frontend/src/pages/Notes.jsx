import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useState } from 'react';

export default function Notes() {
  const [activeDay, setActiveDay] = useState('SEG');

  const days = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];

  // Mock data for each day
  const notesData = {
    'SEG': [
      { id: 1, text: 'Finalizar documentação do projeto do aplicativo', color: 'var(--secondary-blue)' },
      { id: 2, text: 'Revisão da interface gráfica com a equipe', color: 'var(--secondary-blue)' },
      { id: 3, text: 'Enviar relatório de atividades semanal', color: 'var(--danger-red)' }
    ],
    'TER': [
      { id: 4, text: 'Reunião de alinhamento com o cliente', color: 'var(--primary-blue)' }
    ],
    'QUA': [
      { id: 5, text: 'Consulta médica às 14h', color: 'var(--secondary-blue)' },
      { id: 6, text: 'Comprar materiais de escritório pendentes', color: 'var(--danger-red)' }
    ],
    'QUI': [],
    'SEX': [
      { id: 7, text: 'Apresentação de resultados da sprint', color: 'var(--secondary-blue)' },
      { id: 8, text: 'Happy hour da empresa', color: '#10B981' }
    ],
    'SÁB': [
      { id: 9, text: 'Fazer compras no supermercado', color: 'var(--secondary-blue)' }
    ],
    'DOM': []
  };

  const activeNotes = notesData[activeDay] || [];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)', minHeight: '100vh', position: 'relative' }}>
      <Header />

      <main className="page-transition" style={{ padding: '0', display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: '120px' }}>
        
        {/* Title */}
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--secondary-blue)', padding: '0 1.5rem', marginBottom: '1.5rem' }}>
          Tarefas / Anotações
        </h2>

        <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
          
          {/* Sidebar */}
          <div style={{ 
            width: '65px', 
            backgroundColor: '#525252',
            borderTopRightRadius: '12px',
            borderBottomRightRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '1.5rem 0',
            gap: '1rem',
            position: 'relative'
          }}>
            {days.map((dayLabel, idx) => {
              const isActive = dayLabel === activeDay;
              
              return (
              <div key={idx} style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
                
                {/* Blue dot on the edge that moves with the active day */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    right: '-4px', 
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '10px',
                    height: '10px',
                    backgroundColor: 'var(--primary-blue)',
                    borderRadius: '50%',
                    zIndex: 2
                  }}></div>
                )}

                {/* Day Pill */}
                <div 
                  onClick={() => setActiveDay(dayLabel)}
                  style={{
                    backgroundColor: isActive ? 'var(--primary-blue)' : '#EAECEF',
                    color: isActive ? 'white' : 'var(--secondary-blue)',
                    width: '42px',
                    height: '52px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}>
                  {dayLabel}
                </div>
                
                {/* White triangle pointing left */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    right: '0',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 0,
                    height: 0,
                    borderTop: '10px solid transparent',
                    borderBottom: '10px solid transparent',
                    borderRight: '14px solid var(--bg-color)',
                    zIndex: 1
                  }}></div>
                )}
              </div>
            )})}
          </div>

          {/* Cards Area */}
          <div style={{ flex: 1, padding: '0 1.5rem 0 1rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', position: 'relative' }}>
            
            {/* Scrollbar Mock (Blue bar on right) */}
            {activeNotes.length > 0 && (
              <div style={{
                position: 'absolute',
                right: '4px',
                top: '20px',
                width: '4px',
                height: '120px',
                backgroundColor: 'var(--primary-blue)',
                borderRadius: '4px'
              }}></div>
            )}

            {/* Render Notes */}
            {activeNotes.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#6B7280', marginTop: '3rem' }}>Nenhuma tarefa para este dia.</p>
            ) : (
              activeNotes.map((note) => (
                <div key={note.id} style={{ 
                  backgroundColor: '#D1D5DB', 
                  borderRadius: '16px',
                  height: '150px',
                  position: 'relative',
                  padding: '1.2rem',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <p style={{ margin: 0, color: 'var(--secondary-blue)', fontWeight: 600, fontSize: '1rem', opacity: 0.9 }}>
                    {note.text}
                  </p>

                  <div style={{
                    position: 'absolute',
                    bottom: '1rem',
                    right: '1rem',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: note.color,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }}></div>
                </div>
              ))
            )}
            
          </div>

        </div>
        
        {/* Custom Calendário button at bottom right */}
        <button style={{
          position: 'fixed',
          bottom: '100px',
          right: '1.5rem',
          backgroundColor: 'var(--secondary-blue)',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '12px',
          border: 'none',
          fontWeight: 600,
          fontSize: '0.9rem',
          zIndex: 10,
          boxShadow: 'var(--shadow)',
          cursor: 'pointer'
        }}>
          CALENDÁRIO
        </button>

      </main>

      <BottomNav activeTab="notes" />
    </div>
  );
}
