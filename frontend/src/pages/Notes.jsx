import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { useState, useEffect } from 'react';
import { Users, Building2, Pencil, Calendar, Clock, FileText } from 'lucide-react';

export default function Notes() {
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ['Todas', 'Rascunho', 'Reunião', 'Visita Técnica', 'Anotação'];

  // Fetch real entries
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

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Reunião': return '#3b82f6'; // primary blue
      case 'Visita Técnica': return '#10b981'; // green
      case 'Rascunho': return '#ef4444'; // red
      case 'Anotação': return '#f59e0b'; // amber
      default: return '#6b7280'; // gray
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Reunião': return <Users size={16} />;
      case 'Visita Técnica': return <Building2 size={16} />;
      case 'Rascunho': return <Pencil size={16} />;
      case 'Anotação': return <FileText size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const activeNotes = entries.filter(e => {
    if (activeCategory === 'Todas') return true;
    return e.category === activeCategory;
  });

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const d = new Date(dateString);
      if (isNaN(d)) return dateString;
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    } catch {
      return dateString;
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)', minHeight: '100vh', position: 'relative' }}>
      <Header />

      <main className="page-transition" style={{ padding: '0', display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: '120px' }}>
        
        {/* Title */}
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--secondary-blue)', padding: '0 1.5rem', marginBottom: '1rem', marginTop: '0.5rem' }}>
          Bloco de Notas
        </h2>

        {/* Filter Chips - Horizontal Scroll */}
        <div className="no-scrollbar" style={{ 
          display: 'flex', 
          gap: '0.75rem', 
          padding: '0 1.5rem 1rem 1.5rem', 
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          WebkitOverflowScrolling: 'touch'
        }}>
          {categories.map((cat, idx) => {
            const isActive = activeCategory === cat;
            return (
              <button 
                key={idx}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '0.5rem 1.2rem',
                  borderRadius: '20px',
                  border: 'none',
                  backgroundColor: isActive ? 'var(--primary-blue)' : '#EAECEF',
                  color: isActive ? 'white' : 'var(--secondary-blue)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isActive ? '0 4px 10px rgba(59, 130, 246, 0.3)' : 'none',
                  flexShrink: 0
                }}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Masonry/Grid Area */}
        <div style={{ 
          flex: 1, 
          padding: '0.5rem 1.5rem', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
          gap: '1rem',
          alignContent: 'start'
        }}>
          {loading ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#6B7280', marginTop: '2rem' }}>Carregando notas...</p>
          ) : activeNotes.length === 0 ? (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#6B7280', marginTop: '2rem' }}>Nenhuma nota encontrada.</p>
          ) : (
            activeNotes.map((note) => {
              const color = getCategoryColor(note.category);
              return (
                <div key={note._id} style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '16px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                  border: '1px solid #f3f4f6',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  minHeight: '160px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                }}
                >
                  {/* Top Color Accent Line */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: color }}></div>

                  {/* Date & Category Icon */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', marginTop: '0.2rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                      <Calendar size={12} /> {formatDate(note.date)}
                    </span>
                    <div style={{ 
                      width: '24px', height: '24px', borderRadius: '50%', backgroundColor: color + '20', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: color 
                    }}>
                      {getCategoryIcon(note.category)}
                    </div>
                  </div>

                  {/* Main Content */}
                  <p style={{ 
                    margin: 0, 
                    color: 'var(--secondary-blue)', 
                    fontWeight: 600, 
                    fontSize: '0.95rem', 
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    flex: 1
                  }}>
                    {note.text || 'Nota sem conteúdo...'}
                  </p>

                  {/* Location/Time (if exists) */}
                  {(note.location || note.participants) && (
                    <div style={{ marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px dashed #E5E7EB', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {note.location && <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>📍 {note.location}</span>}
                      {note.participants && <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>👥 {note.participants}</span>}
                    </div>
                  )}
                  
                </div>
              );
            })
          )}
        </div>

      </main>

      <BottomNav activeTab="notes" />
    </div>
  );
}
