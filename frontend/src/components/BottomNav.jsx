import { Plus, Home, Calendar, StickyNote, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BottomNav({ activeTab }) {
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav">
      <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => navigate('/dashboard')}>
        <Home size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
        <span>Início</span>
      </div>
      
      <div className={`nav-item ${activeTab === 'agenda' ? 'active' : ''}`} onClick={() => navigate('/agenda')}>
        <Calendar size={24} strokeWidth={activeTab === 'agenda' ? 2.5 : 2} />
        <span>Agenda</span>
      </div>
      
      <div className="nav-fab" onClick={() => navigate('/create')} style={{ transform: activeTab === 'create' ? 'scale(1.05)' : 'scale(1)' }}>
        <Plus size={32} />
      </div>

      <div className={`nav-item ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => navigate('/notes')}>
        <StickyNote size={24} strokeWidth={activeTab === 'notes' ? 2.5 : 2} />
        <span>Notas</span>
      </div>
      
      <div className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => navigate('/profile')}>
        <User size={24} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
        <span>Perfil</span>
      </div>
    </nav>
  );
}
