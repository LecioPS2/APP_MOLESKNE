import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simulate login for now
    console.log('Login attempt with:', email);
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>Bem-vindo(a)</h1>
        <p>Faça login para acessar sua agenda</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
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
            placeholder="Sua senha secreta"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Entrar
        </button>

        <div className="auth-links">
          Não tem uma conta? <Link to="/register">Cadastre-se</Link>
        </div>
      </form>
    </div>
  );
}
