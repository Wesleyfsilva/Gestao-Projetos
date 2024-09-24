import React, { useState, useEffect } from 'react';

interface EditProjectProps {
  token: string;
  projectId: number;
  onUpdate: () => void; // Função para atualizar a lista de projetos
}

const EditProject: React.FC<EditProjectProps> = ({ token, projectId, onUpdate }) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [status, setStatus] = useState<string>('Em andamento');
  const [dueDate, setDueDate] = useState<string>('');

  useEffect(() => {
    const fetchProjectDetails = async () => {
      const response = await fetch(`http://localhost:3001/api/projects/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const project = await response.json();
        setName(project.name);
        setDescription(project.description);
        setStatus(project.status);
        setDueDate(new Date(project.dueDate).toISOString().split('T')[0]);
      }
    };

    fetchProjectDetails();
  }, [projectId, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(`http://localhost:3001/api/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description, status, dueDate }),
    });

    if (response.ok) {
      alert('Projeto atualizado com sucesso');
      onUpdate();  // Atualiza a lista de projetos
    } else {
      alert('Erro ao atualizar o projeto');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="edit-project-form">
      <h3>Editar Projeto</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome do Projeto"
        className="edit-input"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descrição"
        className="edit-input"
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)} className="edit-input">
        <option value="Em andamento">Em andamento</option>
        <option value="Concluído">Concluído</option>
        <option value="Pendente">Pendente</option>
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="edit-input"
      />
      <button type="submit" className="edit-button">Atualizar Projeto</button>
    </form>
  );
};

export default EditProject;
