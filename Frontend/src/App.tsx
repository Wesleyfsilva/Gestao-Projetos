import React, { useState, useEffect } from 'react';
import Login from './Login';
import CreateProject from './CreateProject';
import ProjectList from './ProjectList';
import Register from './Register';
import './Styles/Global.css';



const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [projects, setProjects] = useState<any[]>([]); // Adiciona estado para lista de projetos

  

  // Função para navegar para a página de registro
  const navigateToRegister = () => {
    setIsRegistering(true);
  };

  // Função para voltar para a página de login
  const navigateToLogin = () => {
    setIsRegistering(false);
  };

  // Função para salvar o token e persistir no localStorage
  const saveToken = (userToken: string) => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
  };

  // Recupera o token do localStorage quando a página é carregada ou atualizada
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Função para atualizar a lista de projetos
  const fetchProjects = async () => {
    if (!token) return;

    const response = await fetch('http://localhost:3001/api/projects', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setProjects(data);
    }
  };

  // Função de logout
  const handleLogout = () => {
    localStorage.removeItem('token');  
    setToken(null);  
  };

  if (!token) {
    if (isRegistering) {
      return <Register navigateToLogin={navigateToLogin} />;
    }
    return <Login setToken={saveToken} navigateToRegister={navigateToRegister} />;
  }

  return (
    <div className="app-container">
      <h1 className="app-title">Bem-vindo ao Gerenciador de Projetos</h1>
      <button onClick={handleLogout} className="logout-button">Logout</button>
      <CreateProject token={token} onProjectAdded={fetchProjects} /> {/* Passa a função de atualização */}
      <ProjectList token={token} projects={projects} setProjects={setProjects} /> {/* Passa a lista de projetos e função de atualização */}
    </div>
  );
};

export default App;
