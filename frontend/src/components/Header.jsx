import { Bell, User } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const firstName = user?.name ? user.name.split(' ')[0] : 'Usuário';

  const [hasImportantEventToday, setHasImportantEventToday] = useState(false);

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
          const todayStr = new Date().toISOString().split('T')[0];
          
          const importantToday = data.some(entry => {
            if (!entry.date || !entry.date.startsWith(todayStr)) return false;
            return entry.category === 'Visita Técnica' || entry.category === 'Reunião';
          });
          
          setHasImportantEventToday(importantToday);
        }
      } catch (err) {
        console.error("Error fetching events for notification bell:", err);
      }
    };
    
    fetchEntries();
  }, []);

  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1.5rem', 
      position: 'sticky',
      top: 0,
      backgroundColor: 'var(--bg-color)',
      zIndex: 50
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '50px', height: '50px', backgroundColor: '#E2E8F0',
          borderRadius: '50%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: '#1D2671'
        }}>
          <User size={24} />
        </div>
        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem' }}>Olá, {firstName}</span>
      </div>
      <div className={hasImportantEventToday ? "radar-pulse-active" : ""} style={{
        width: '40px', height: '40px', backgroundColor: '#E2E8F0',
        borderRadius: '50%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: '#1D2671', cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}>
        <Bell size={20} />
      </div>
    </header>
  );
}
