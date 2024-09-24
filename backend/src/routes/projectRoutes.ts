import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import authenticateToken from '../middleware/authMiddleware';

const prisma = new PrismaClient();
const projectRoutes = Router();

// Rota para criação de projeto
projectRoutes.post('/', authenticateToken, async (req: any, res: Response) => {
  const { name, description, status, dueDate } = req.body;

  // Validação básica dos campos
  if (!name || !description || !status || !dueDate) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    // Converter a data para o formato Date (ISO-8601)
    const formattedDueDate = new Date(dueDate);  // Converte a string para um objeto Date

    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        status,
        dueDate: formattedDueDate,  // Usa a data convertida
        userId: req.user.id,        // Garantido pelo middleware de autenticação
      },
    });

    res.status(201).json(newProject);
  } catch (error) {
    console.error('Erro ao criar o projeto:', error);  // Log do erro no console
    res.status(500).json({ error: 'Erro ao criar o projeto.' });
  }
});

// Rota para listar todos os projetos do usuário autenticado
projectRoutes.get('/', authenticateToken, async (req: any, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        userId: req.user.id, // Lista apenas os projetos do usuário autenticado
      },
    });

    res.status(200).json(projects);
  } catch (error) {
    console.error('Erro ao buscar projetos:', error);
    res.status(500).json({ error: 'Erro ao buscar projetos.' });
  }
});

// Rota para atualizar um projeto existente
projectRoutes.put('/:id', authenticateToken, async (req: any, res: Response) => {
  const { id } = req.params;
  const { name, description, status, dueDate } = req.body;

  try {
    const project = await prisma.project.update({
      where: { id: Number(id), userId: req.user.id },
      data: { name, description, status, dueDate: new Date(dueDate) },
    });

    res.status(200).json(project);
  } catch (error) {
    console.error('Erro ao atualizar projeto:', error);
    res.status(500).json({ error: 'Erro ao atualizar projeto.' });
  }
});

// Rota para deletar um projeto
projectRoutes.delete('/:id', authenticateToken, async (req: any, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.project.delete({
      where: { id: Number(id), userId: req.user.id },
    });

    res.status(204).send(); // Resposta sem conteúdo, pois o projeto foi deletado
  } catch (error) {
    console.error('Erro ao deletar projeto:', error);
    res.status(500).json({ error: 'Erro ao deletar projeto.' });
  }
});

export default projectRoutes;
