import { Bell, User } from 'lucide-react';

export default function Header() {
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
        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem' }}>Olá, Fulano</span>
      </div>
      <div style={{
        width: '40px', height: '40px', backgroundColor: '#E2E8F0',
        borderRadius: '50%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', color: '#1D2671', cursor: 'pointer'
      }}>
        <Bell size={20} />
      </div>
    </header>
  );
}
