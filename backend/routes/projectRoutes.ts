import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import authenticateToken from '../middleware/authMiddleware'; // Middleware de autenticação

const prisma = new PrismaClient();
const projectRoutes = Router();

// Rota para criar um novo projeto (CREATE)
projectRoutes.post('/projects', authenticateToken, async (req: any, res: Response) => {
  const { name, description, status, dueDate } = req.body;

  console.log('Dados recebidos para criação:', { name, description, status, dueDate });

  try {
    // Converte `dueDate` para um objeto Date
    const parsedDueDate = new Date(dueDate);

    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        status,
        dueDate: parsedDueDate,
        userId: req.user.id, // Associando o projeto ao usuário autenticado
      },
    });

    console.log('Projeto criado com sucesso:', newProject);
    res.json(newProject);
  } catch (error) {
    console.error('Erro ao criar o projeto:', error);
    res.status(500).json({ error: 'Erro ao criar o projeto.' });
  }
});

// Rota para listar os projetos do usuário autenticado (READ)
projectRoutes.get('/projects', authenticateToken, async (req: any, res: Response) => {
  try {
    console.log('ID do usuário autenticado:', req.user?.id);

    const projects = await prisma.project.findMany({
      where: {
        userId: req.user.id, // Obtendo os projetos do usuário autenticado
      },
    });

    console.log('Projetos encontrados:', projects);
    res.json(projects);
  } catch (error) {
    console.error('Erro ao listar projetos:', error);
    res.status(500).json({ error: 'Erro ao listar os projetos.' });
  }
});

// Rota para atualizar um projeto existente (UPDATE)
projectRoutes.put('/projects/:id', authenticateToken, async (req: any, res: Response) => {
  const { id } = req.params;
  const { name, description, status, dueDate } = req.body;

  console.log('Dados recebidos para atualização:', { name, description, status, dueDate });

  try {
    const updatedProject = await prisma.project.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        status,
        dueDate: new Date(dueDate), // Convertendo a data novamente
      },
    });

    console.log('Projeto atualizado com sucesso:', updatedProject);
    res.json(updatedProject);
  } catch (error) {
    console.error('Erro ao atualizar o projeto:', error);
    res.status(500).json({ error: 'Erro ao atualizar o projeto.' });
  }
});

// Rota para deletar um projeto existente (DELETE)
projectRoutes.delete('/projects/:id', authenticateToken, async (req: any, res: Response) => {
  const { id } = req.params; // O ID deve ser o valor numérico do projeto

  console.log('ID do projeto para deletar:', id);

  try {
    // Convertendo o ID para número (inteiro)
    await prisma.project.delete({
      where: {
        id: Number(id), // O Prisma espera que o ID seja do tipo inteiro
      },
    });

    console.log('Projeto deletado com sucesso!');
    res.json({ message: 'Projeto deletado com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar o projeto:', error);
    res.status(500).json({ error: 'Erro ao deletar o projeto.' });
  }
});


export default projectRoutes;
