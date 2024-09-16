import React from 'react';
import EditProject from './EditProject';

interface ProjectListProps {
  token: string;
  projects: any[];
  setProjects: React.Dispatch<React.SetStateAction<any[]>>; // Função para atualizar o estado de projetos
}

const ProjectList: React.FC<ProjectListProps> = ({ token, projects, setProjects }) => {
  const [editingProjectId, setEditingProjectId] = React.useState<number | null>(null);

  // Função para buscar os projetos
  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        alert('Erro ao buscar projetos');
      }
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
    }
  };

  // Função para deletar um projeto
  const deleteProject = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Atualiza a lista localmente após a exclusão
        setProjects(prevProjects => prevProjects.filter(project => project.id !== id));
      } else {
        alert('Erro ao deletar o projeto');
      }
    } catch (error) {
      console.error('Erro ao deletar o projeto:', error);
    }
  };

  // Função para atualizar a lista após editar
  const handleUpdate = () => {
    setEditingProjectId(null);  // Fechar o formulário de edição após a atualização
    fetchProjects();  // Atualiza a lista de projetos
  };

  React.useEffect(() => {
    fetchProjects();  // Buscar projetos quando o componente é montado
  }, [token]);

  return (
    <div className="project-list-container">
      {projects.length === 0 ? (
        <p>Nenhum projeto encontrado.</p>
      ) : (
        projects.map((project) => (
          <div key={project.id} className="project-item">
            <h4>{project.name}</h4>
            <p>{project.description}</p>
            <p>Status: {project.status}</p>
            <p>Prazo: {new Date(project.dueDate).toLocaleDateString()}</p>
            <div>
              <button
                onClick={() => deleteProject(project.id)}
                className="button button-danger button-group"
              >
                Excluir
              </button>
              <button
                onClick={() => setEditingProjectId(project.id)}
                className="button button-edit button-group"
              >
                Editar
              </button>
            </div>
            {editingProjectId === project.id && (
              <EditProject token={token} projectId={project.id} onUpdate={handleUpdate} />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ProjectList;
