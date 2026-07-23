import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { Search, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MoreVertical, ExternalLink } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  
  // Date logic
  const today = new Date();
  const weekday = today.toLocaleDateString('pt-BR', { weekday: 'long' });
  const dayMonth = today.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const fullName = user?.name || 'Usuário';
  const firstName = fullName.split(' ')[0];

  // Fetch entries from DB
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch('/api/entries', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Filter to only today's entries for the dashboard (mock logic)
          // In real app we might parse the ISO date or datetime-local
          setEntries(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  const getEventColor = (category) => {
    switch (category) {
      case 'Reunião': return { color: 'var(--secondary-blue)', bgColor: '#F3F4F6' };
      case 'Visita Técnica': return { color: 'var(--primary-blue)', bgColor: '#EFF6FF' };
      default: return { color: 'var(--danger-red)', bgColor: '#FDF2F2' };
    }
  };

  const pad = (n) => n.toString().padStart(2, '0');
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  const todaysEntries = entries.filter(e => e.date && e.date.startsWith(todayStr));

  const displayEvents = todaysEntries.slice(0, 3).map(e => ({
    id: e._id,
    time: e.date ? e.date.split('T')[1] || e.date.split(' ')[1] || '12:00' : '12:00', // simple mock extraction
    title: e.category,
    description: e.location ? `${e.location} - ${e.participants}` : e.text || 'Sem descrição',
    ...getEventColor(e.category)
  }));

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
          borderRadius: '16px', 
          padding: '1.5rem', 
          display: 'flex', 
          flexDirection: 'column',
          gap: '1rem',
          color: 'white',
          marginBottom: '2rem',
          boxShadow: '0 10px 25px rgba(49, 54, 121, 0.15)'
        }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ 
              width: '55px', 
              height: '55px', 
              backgroundColor: 'white', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--secondary-blue)',
              fontSize: '1.5rem',
              fontWeight: 700,
              flexShrink: 0
            }}>
              {firstName.charAt(0).toUpperCase()}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, letterSpacing: '0.5px' }}>Olá, {firstName}!</h2>
              <p style={{ fontSize: '0.85rem', opacity: 0.9, margin: 0, marginTop: '4px' }}>
                Você tem {todaysEntries.length} {todaysEntries.length === 1 ? 'compromisso' : 'compromissos'} hoje.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Agenda Section */}
        <h3 style={{ fontSize: '1rem', color: 'var(--secondary-blue)', fontWeight: 600, marginBottom: '1.5rem' }}>
          {capitalizedWeekday} <span style={{ fontWeight: 400 }}>{dayMonth}</span>
        </h3>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#6B7280', marginTop: '2rem' }}>Carregando compromissos...</p>
        ) : displayEvents.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6B7280', marginTop: '2rem' }}>Você não tem compromissos hoje.</p>
        ) : (
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>
            {/* The Vertical Line */}
            <div style={{ 
              position: 'absolute', 
              left: '3.75rem', 
              top: '1rem', 
              bottom: '2rem', 
              width: '0px', 
              borderLeft: '2px dashed #E5E7EB' 
            }}></div>
            
            {displayEvents.map((event) => (
              <div key={event.id} style={{ display: 'flex', position: 'relative', alignItems: 'stretch' }}>
                
                {/* Time Label */}
                <div style={{ width: '3.5rem', flexShrink: 0, fontSize: '0.75rem', color: '#111', fontWeight: 600, paddingTop: '1rem' }}>
                  {event.time.substring(0, 5)}
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
                  
                  {/* Options Button */}
                  <div style={{ position: 'absolute', top: '1rem', right: '0.8rem' }}>
                    <button 
                      onClick={() => setOpenMenuId(openMenuId === event.id ? null : event.id)}
                      style={{ 
                        background: 'transparent',
                        border: 'none',
                        color: '#9CA3AF',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%'
                      }}>
                      <MoreVertical size={20} />
                    </button>

                    {/* Popup Menu */}
                    {openMenuId === event.id && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        backgroundColor: 'white',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        borderRadius: '12px',
                        padding: '0.5rem',
                        zIndex: 10,
                        minWidth: '180px',
                        border: '1px solid #F3F4F6'
                      }}>
                        <button 
                          onClick={() => {
                            setOpenMenuId(null);
                            alert("Configuração do Google Agenda requerida no seu perfil.");
                          }}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'transparent',
                            border: 'none',
                            color: '#4B5563',
                            padding: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            textAlign: 'left'
                          }}>
                          <ExternalLink size={16} color="#4285F4" />
                          Enviar p/ Google Agenda
                        </button>
                      </div>
                    )}
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
