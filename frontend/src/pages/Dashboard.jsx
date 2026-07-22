import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { Search, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  
  // Date logic
  const today = new Date();
  const weekday = today.toLocaleDateString('pt-BR', { weekday: 'long' });
  const dayMonth = today.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);

  // Mock Events
  const events = [
    {
      id: 1,
      time: '11:00',
      title: 'Reunião de Alinhamento',
      description: 'Discussão sobre o novo layout.',
      color: 'var(--secondary-blue)',
      bgColor: '#F3F4F6'
    },
    {
      id: 2,
      time: '14:30',
      title: 'Visita Técnica',
      description: 'Cliente X - Instalação do sistema.',
      color: 'var(--primary-blue)',
      bgColor: '#EFF6FF'
    },
    {
      id: 3,
      time: '16:00',
      title: 'Apresentação Final',
      description: 'Mostra de resultados do trimestre.',
      color: 'var(--danger-red)',
      bgColor: '#FDF2F2'
    }
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)', minHeight: '100vh', position: 'relative' }}>
      <Header />

      <main className="page-transition" style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: '120px' }}>
        
        {/* Title */}
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--secondary-blue)', marginBottom: '1.5rem', lineHeight: '1.3' }}>
          Transforme suas anotações<br/>em resultados.
        </h1>

        {/* Search Bar */}
        <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.5rem' }}>
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: '#F3F4F6', 
            borderRadius: '8px',
            padding: '0 1rem'
          }}>
            <Search size={18} color="#9CA3AF" />
            <input 
              type="text" 
              placeholder="Pesquisar." 
              style={{ 
                border: 'none', 
                backgroundColor: 'transparent', 
                padding: '0.8rem 0.5rem', 
                width: '100%', 
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.9rem'
              }} 
            />
          </div>
          <button style={{
            backgroundColor: 'var(--secondary-blue)',
            border: 'none',
            borderRadius: '8px',
            width: '45px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            cursor: 'pointer'
          }}>
            <SlidersHorizontal size={20} />
          </button>
        </div>

        {/* Quick Access Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <button 
            onClick={() => navigate('/notes')}
            style={{ 
              flex: 1, 
              backgroundColor: '#10B981', 
              color: 'white', 
              padding: '1rem', 
              borderRadius: '12px', 
              border: 'none', 
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)'
            }}>
            Notas
          </button>
          <button 
            onClick={() => navigate('/agenda')}
            style={{ 
              flex: 1, 
              backgroundColor: '#F07167', 
              color: 'white', 
              padding: '1rem', 
              borderRadius: '12px', 
              border: 'none', 
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(240, 113, 103, 0.2)'
            }}>
            Agenda
          </button>
        </div>

        {/* Dark Blue Banner */}
        <div style={{ 
          backgroundColor: 'var(--secondary-blue)', 
          borderRadius: '12px', 
          padding: '1.2rem', 
          display: 'flex', 
          gap: '1rem',
          color: 'white',
          marginBottom: '2rem'
        }}>
          {/* Avatar Placeholder */}
          <div style={{ 
            width: '75px', 
            height: '80px', 
            backgroundColor: 'white', 
            borderRadius: '8px',
            flexShrink: 0
          }}></div>
          
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 600, margin: 0, letterSpacing: '0.5px' }}>Fulano de Tal</h2>
            <p style={{ fontSize: '0.75rem', opacity: 0.9, marginBottom: '0.8rem' }}>Olá, Fulano</p>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                Olá, Fulano <ArrowRight size={16} />
              </div>
              <div style={{ width: '80px', height: '22px', backgroundColor: 'white', borderRadius: '12px' }}></div>
            </div>
          </div>
        </div>

        {/* Dynamic Agenda Section */}
        <h3 style={{ fontSize: '1rem', color: 'var(--secondary-blue)', fontWeight: 600, marginBottom: '1.5rem' }}>
          {capitalizedWeekday} <span style={{ fontWeight: 400 }}>{dayMonth}</span>
        </h3>

        {events.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6B7280', marginTop: '2rem' }}>Você não tem compromissos hoje.</p>
        ) : (
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>
            {/* The Vertical Line */}
            <div style={{ 
              position: 'absolute', 
              left: '3.75rem', 
              top: '1rem', 
              bottom: '2rem', 
              width: '1.5px', 
              backgroundColor: '#000' 
            }}></div>
            
            {events.map((event) => (
              <div key={event.id} style={{ display: 'flex', position: 'relative', alignItems: 'stretch' }}>
                
                {/* Time Label */}
                <div style={{ width: '3.5rem', flexShrink: 0, fontSize: '0.75rem', color: '#111', fontWeight: 600, paddingTop: '1rem' }}>
                  {event.time}
                </div>
                
                {/* Event Card */}
                <div style={{ 
                  flex: 1, 
                  backgroundColor: 'white', 
                  borderRadius: '16px', 
                  padding: '1.2rem', 
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)', 
                  marginLeft: '1.5rem', 
                  position: 'relative', 
                  minHeight: '110px',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {/* Dot */}
                  <div style={{ 
                    position: 'absolute', 
                    left: '-1.85rem', 
                    top: '1rem', 
                    width: '14px', 
                    height: '14px', 
                    borderRadius: '50%', 
                    backgroundColor: event.color, 
                    border: '2px solid var(--bg-color)', 
                    zIndex: 2 
                  }}></div>
                  
                  {/* Card Content */}
                  <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--secondary-blue)' }}>{event.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#6B7280', marginTop: '0.3rem' }}>{event.description}</p>
                  
                  {/* Avatars Container */}
                  <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', display: 'flex' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', border: `1px solid ${event.color}`, backgroundColor: event.bgColor, zIndex: 1 }}></div>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', border: `1px solid ${event.color}`, backgroundColor: event.bgColor, marginLeft: '-8px', zIndex: 2 }}></div>
                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: event.color, marginLeft: '-8px', zIndex: 3 }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      <BottomNav activeTab="home" />
    </div>
  );
}
