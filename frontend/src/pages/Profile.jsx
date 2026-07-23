import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { Camera, LogOut, Save, KeyRound, CalendarDays, ExternalLink, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'password', or 'integrations'
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Load Profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch('/api/auth/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            birthDate: data.birthDate || ''
          });
          
          // Update localStorage cache just in case
          const cachedUser = JSON.parse(localStorage.getItem('user') || '{}');
          localStorage.setItem('user', JSON.stringify({ ...cachedUser, name: data.name, email: data.email }));
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setMessage({ text: 'Perfil atualizado com sucesso!', type: 'success' });
        const cachedUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...cachedUser, name: updatedUser.name, email: updatedUser.email }));
      } else {
        const errData = await res.json();
        setMessage({ text: errData.message || 'Erro ao atualizar o perfil', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Erro de conexão', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const initial = formData.name ? formData.name.charAt(0).toUpperCase() : 'U';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)', minHeight: '100vh', position: 'relative' }}>
      <Header />

      <main className="page-transition" style={{ padding: '0 1.5rem', display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: '120px' }}>
        
        {/* Avatar Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ 
              width: '100px', 
              height: '100px', 
              backgroundColor: 'var(--secondary-blue)', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '2.5rem',
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(49, 54, 121, 0.2)'
            }}>
              {initial}
            </div>
            <button style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: 'var(--primary-blue)',
              color: 'white',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid var(--bg-color)',
              cursor: 'pointer'
            }}>
              <Camera size={18} />
            </button>
          </div>
          <h2 style={{ marginTop: '1rem', fontSize: '1.3rem', color: 'var(--text-primary)', fontWeight: 700 }}>{formData.name || 'Carregando...'}</h2>
          <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>{formData.email}</p>
        </div>

        {/* Tab Switcher - Now with 3 Tabs */}
        <div style={{ display: 'flex', backgroundColor: '#EAECEF', borderRadius: '12px', padding: '4px', marginBottom: '1.5rem', overflowX: 'auto' }}>
          <button 
            onClick={() => { setActiveTab('info'); setMessage({text:'', type:''}); }}
            style={{ 
              flex: 1, 
              minWidth: '100px',
              padding: '0.7rem 0.5rem', 
              borderRadius: '8px', 
              border: 'none', 
              backgroundColor: activeTab === 'info' ? 'white' : 'transparent',
              color: activeTab === 'info' ? 'var(--text-primary)' : '#6B7280',
              fontWeight: 600,
              fontSize: '0.85rem',
              boxShadow: activeTab === 'info' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
            Dados
          </button>
          <button 
            onClick={() => { setActiveTab('password'); setMessage({text:'', type:''}); }}
            style={{ 
              flex: 1,
              minWidth: '100px', 
              padding: '0.7rem 0.5rem', 
              borderRadius: '8px', 
              border: 'none', 
              backgroundColor: activeTab === 'password' ? 'white' : 'transparent',
              color: activeTab === 'password' ? 'var(--text-primary)' : '#6B7280',
              fontWeight: 600,
              fontSize: '0.85rem',
              boxShadow: activeTab === 'password' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
            Segurança
          </button>
          <button 
            onClick={() => { setActiveTab('integrations'); setMessage({text:'', type:''}); }}
            style={{ 
              flex: 1, 
              minWidth: '100px',
              padding: '0.7rem 0.5rem', 
              borderRadius: '8px', 
              border: 'none', 
              backgroundColor: activeTab === 'integrations' ? 'white' : 'transparent',
              color: activeTab === 'integrations' ? 'var(--text-primary)' : '#6B7280',
              fontWeight: 600,
              fontSize: '0.85rem',
              boxShadow: activeTab === 'integrations' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
            Integrações
          </button>
        </div>

        {message.text && (
          <div style={{ 
            padding: '1rem', 
            borderRadius: '12px', 
            backgroundColor: message.type === 'success' ? '#D1FAE5' : '#FEE2E2',
            color: message.type === 'success' ? '#065F46' : '#991B1B',
            marginBottom: '1rem',
            textAlign: 'center',
            fontWeight: 500,
            fontSize: '0.9rem'
          }}>
            {message.text}
          </div>
        )}

        {/* Forms & Sections */}
        <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: 'var(--shadow)' }}>
          
          {loading ? (
             <p style={{ textAlign: 'center', color: '#6B7280', padding: '2rem 0' }}>Carregando...</p>
          ) : activeTab === 'info' ? (
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="input-group">
                <label>Nome Completo</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required 
                />
              </div>
              <div className="input-group">
                <label>E-mail</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  required 
                />
              </div>
              <div className="input-group">
                <label>Telefone</label>
                <input 
                  type="tel" 
                  placeholder="(00) 00000-0000" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                />
              </div>
              <div className="input-group">
                <label>Data de Nascimento</label>
                <input 
                  type="date" 
                  value={formData.birthDate}
                  onChange={(e) => setFormData({...formData, birthDate: e.target.value})} 
                />
              </div>
              
              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }} disabled={saving}>
                {saving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />} 
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </form>
          ) : activeTab === 'password' ? (
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="input-group">
                <label>Senha Atual</label>
                <input type="password" placeholder="Digite sua senha atual" />
              </div>
              <div className="input-group">
                <label>Nova Senha</label>
                <input type="password" placeholder="Digite a nova senha" />
              </div>
              <div className="input-group">
                <label>Confirmar Nova Senha</label>
                <input type="password" placeholder="Confirme a nova senha" />
              </div>
              
              <button type="button" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
                <KeyRound size={20} /> Atualizar Senha
              </button>
            </form>
          ) : (
            // Integrations Tab
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--secondary-blue)' }}>Conexões Externas</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#6B7280', marginTop: '4px' }}>Sincronize o Moleskine com seus apps favoritos.</p>
              </div>

              {/* Google Calendar Card */}
              <div style={{ 
                border: '1px solid #E5E7EB', 
                borderRadius: '16px', 
                padding: '1.2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                backgroundColor: '#F9FAFB'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '45px', height: '45px', borderRadius: '12px', 
                    backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                  }}>
                    {/* Google Calendar Icon Mock */}
                    <CalendarDays size={24} color="#4285F4" />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', color: '#111' }}>Google Agenda</h4>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280', marginTop: '2px' }}>Envie seus eventos diretamente.</p>
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#4B5563', lineHeight: '1.4' }}>
                  A sincronização enviará automaticamente as **Reuniões** e **Visitas Técnicas** criadas aqui para a nuvem da sua conta Google.
                </div>

                <button 
                  type="button" 
                  onClick={() => alert("Interface preparada! Para funcionar no servidor real, configure suas credenciais de OAuth2.0 do Google Cloud no arquivo .env")}
                  style={{
                    backgroundColor: 'white',
                    color: '#4285F4',
                    border: '1px solid #4285F4',
                    padding: '0.8rem',
                    borderRadius: '10px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#EFF6FF'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <ExternalLink size={18} />
                  Conectar ao Google
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Logout Button */}
        <button 
          className="btn btn-danger" 
          style={{ marginTop: '2rem', backgroundColor: '#FEE2E2', color: 'var(--danger-red)', padding: '1rem', marginBottom: '2rem' }}
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}
        >
          <LogOut size={20} /> Sair da Conta
        </button>

      </main>

      <BottomNav activeTab="profile" />
    </div>
  );
}
