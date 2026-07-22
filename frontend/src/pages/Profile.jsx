import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { Camera, LogOut, Save, KeyRound } from 'lucide-react';
import { useState } from 'react';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('info'); // 'info' or 'password'

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
              F
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
          <h2 style={{ marginTop: '1rem', fontSize: '1.3rem', color: 'var(--text-primary)', fontWeight: 700 }}>Fulano de Tal</h2>
          <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>fulano@exemplo.com</p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', backgroundColor: '#EAECEF', borderRadius: '12px', padding: '4px', marginBottom: '1.5rem' }}>
          <button 
            onClick={() => setActiveTab('info')}
            style={{ 
              flex: 1, 
              padding: '0.8rem', 
              borderRadius: '8px', 
              border: 'none', 
              backgroundColor: activeTab === 'info' ? 'white' : 'transparent',
              color: activeTab === 'info' ? 'var(--text-primary)' : '#6B7280',
              fontWeight: 600,
              boxShadow: activeTab === 'info' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
              cursor: 'pointer'
            }}>
            Dados Pessoais
          </button>
          <button 
            onClick={() => setActiveTab('password')}
            style={{ 
              flex: 1, 
              padding: '0.8rem', 
              borderRadius: '8px', 
              border: 'none', 
              backgroundColor: activeTab === 'password' ? 'white' : 'transparent',
              color: activeTab === 'password' ? 'var(--text-primary)' : '#6B7280',
              fontWeight: 600,
              boxShadow: activeTab === 'password' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
              cursor: 'pointer'
            }}>
            Segurança
          </button>
        </div>

        {/* Forms */}
        <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: 'var(--shadow)' }}>
          {activeTab === 'info' ? (
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="input-group">
                <label>Nome Completo</label>
                <input type="text" defaultValue="Fulano de Tal" />
              </div>
              <div className="input-group">
                <label>E-mail</label>
                <input type="email" defaultValue="fulano@exemplo.com" />
              </div>
              <div className="input-group">
                <label>Telefone</label>
                <input type="tel" placeholder="(00) 00000-0000" />
              </div>
              <div className="input-group">
                <label>Data de Nascimento</label>
                <input type="date" />
              </div>
              
              <button type="button" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                <Save size={20} /> Salvar Alterações
              </button>
            </form>
          ) : (
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
          )}
        </div>

        {/* Logout Button */}
        <button className="btn btn-danger" style={{ marginTop: '2rem', backgroundColor: '#FEE2E2', color: 'var(--danger-red)', padding: '1rem' }}>
          <LogOut size={20} /> Sair da Conta
        </button>

      </main>

      <BottomNav activeTab="profile" />
    </div>
  );
}
