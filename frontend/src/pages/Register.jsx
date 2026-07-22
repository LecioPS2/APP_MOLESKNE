import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simulate registration for now
    console.log('Register attempt with:', { name, email });
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>Criar Conta</h1>
        <p>Junte-se à nós e organize sua rotina</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="name">Nome Completo</label>
          <input
            type="text"
            id="name"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            placeholder="Crie uma senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-secondary">
          Cadastrar
        </button>

        <div className="auth-links">
          Já tem uma conta? <Link to="/login">Faça Login</Link>
        </div>
      </form>
    </div>
  );
}
