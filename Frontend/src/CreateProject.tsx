import React, { useState } from 'react';
import './Styles/CreateProject.css';  

interface CreateProjectProps {
  token: string;
  onProjectAdded: () => void;
}

const CreateProject: React.FC<CreateProjectProps> = ({ token, onProjectAdded }) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [status, setStatus] = useState<string>('Em andamento');
  const [dueDate, setDueDate] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3001/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description, status, dueDate }),
    });

    if (response.ok) {
      alert('Projeto criado com sucesso');
      setName('');
      setDescription('');
      setStatus('Em andamento');
      setDueDate('');
      onProjectAdded();  // Atualiza a lista de projetos
    } else {
      alert('Erro ao criar o projeto');
    }
  };

  return (
    <div className="create-project-container">
      <form onSubmit={handleSubmit} className="create-project-form">
        <h2>Criar Novo Projeto</h2>
        <input
          type="text"
          placeholder="Nome do Projeto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="create-input"
        />
        <input
          type="text"
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="create-input"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="create-input">
          <option value="Em andamento">Em andamento</option>
          <option value="Concluído">Concluído</option>
          <option value="Pendente">Pendente</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="create-input"
        />
        <button type="submit" className="create-button">Criar Projeto</button>
      </form>
    </div>
  );
};

export default CreateProject;
