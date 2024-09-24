import React, { useState } from 'react';
import '../Styles/Login.css';
 

interface LoginProps {
  setToken: (token: string) => void;
  navigateToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ setToken, navigateToRegister }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Envia a requisição de login
    const response = await fetch('http://localhost:3001/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const { token } = await response.json();
      setToken(token);  
    } else {
      alert('Login inválido');
    }
  };

  return (
    <div className="container">
      <p className="system-description">Sistema de Gestão de Projetos</p> {}
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button type="submit" className="login-button">Login</button>
        </form>
        <p>Não tem uma conta? <button onClick={navigateToRegister} className="register-button">Registrar</button></p>
      </div>
    </div>
  );
};

export default Login;
