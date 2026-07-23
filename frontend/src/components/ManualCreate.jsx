import { X, Save, Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';

export default function ManualCreate({ onClose, initialData = null }) {
  const [category, setCategory] = useState(initialData?.category || 'Anotação');
  const [date, setDate] = useState(initialData?.date || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [participants, setParticipants] = useState(initialData?.participants || '');
  const [text, setText] = useState(initialData?.text || '');
  const [loading, setLoading] = useState(false);
  
  const categories = ['Rascunho', 'Visita Técnica', 'Anotação', 'Reunião'];

  const handleSave = async () => {
    if (!date) {
      alert('Por favor, selecione uma data.');
      return;
    }
    
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      const isEditing = !!initialData?._id;
      const url = isEditing ? `/api/entries/${initialData._id}` : '/api/entries';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ category, date, text, location, participants })
      });
      
      if (!res.ok) throw new Error('Falha ao salvar anotação');
      
      alert('Anotação salva com sucesso!');
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-transition" style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: '#F9FAFB', // slight paper off-white
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      color: 'var(--text-primary)'
    }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', backgroundColor: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.5rem', marginLeft: '-0.5rem' }}>
          <X size={28} />
        </button>
        <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--secondary-blue)' }}>Nova Anotação</div>
        <button onClick={handleSave} disabled={loading} style={{ background: 'transparent', border: 'none', color: loading ? '#9CA3AF' : 'var(--primary-blue)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1rem', marginRight: '-0.5rem' }}>
          <Save size={20} strokeWidth={2.5} />
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Category Selector */}
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--secondary-blue)', marginBottom: '0.8rem' }}>Categoria</label>
          <div style={{ position: 'relative' }}>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                fontSize: '1rem',
                outline: 'none',
                backgroundColor: 'white',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                cursor: 'pointer'
              }}
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Field */}
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--secondary-blue)', marginBottom: '0.8rem' }}>Data e Horário</label>
          <div style={{ position: 'relative' }}>
            <CalendarIcon size={20} color="#9CA3AF" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="datetime-local" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem 1rem 1rem 3rem',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                fontSize: '1rem',
                outline: 'none',
                backgroundColor: 'white',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
            />
          </div>
        </div>

        {/* Dynamic Fields for Reunião */}
        {category === 'Reunião' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#F3F4F6', padding: '1.2rem', borderRadius: '16px', border: '1px dashed #D1D5DB' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--secondary-blue)', marginBottom: '0.8rem' }}>Local da Reunião</label>
              <input 
                type="text" 
                placeholder="Ex: Sala 2 ou Link do Meet"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '1rem', outline: 'none', backgroundColor: 'white', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--secondary-blue)', marginBottom: '0.8rem' }}>Participantes</label>
              <input 
                type="text" 
                placeholder="Ex: João, Cliente X"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '1rem', outline: 'none', backgroundColor: 'white', color: 'var(--text-primary)' }}
              />
            </div>
          </div>
        )}

        {/* Text Area (Notepad) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--secondary-blue)', marginBottom: '0.8rem' }}>Bloco de Notas</label>
          <textarea 
            placeholder="Comece a digitar os detalhes aqui..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              flex: 1,
              width: '100%',
              minHeight: '200px',
              padding: '1.2rem',
              borderRadius: '16px',
              border: '1px solid #E5E7EB',
              fontSize: '1.05rem',
              lineHeight: '1.6',
              outline: 'none',
              backgroundColor: 'white',
              resize: 'none',
              fontFamily: 'inherit',
              color: 'var(--text-primary)',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.03)'
            }}
          ></textarea>
        </div>

      </div>
    </div>
  );
}
