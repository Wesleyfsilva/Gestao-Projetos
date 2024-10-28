import { Request, Response } from 'express';
import prisma from '../models/prisma'; // Importa o Prisma de models/prisma

export const createProject = async (req: any, res: Response) => {
  const { name, description, status, dueDate } = req.body;

  if (!name || !description || !status || !dueDate) {
    return res.status(400).json({
     error: 'Todos os campos são obrigatórios.' });
  }

  try {
    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        status,
        dueDate: new Date(dueDate),
        userId: req.user.id,
      },
    });
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Erro ao criar o projeto:', error);
    res.status(500).json({ error: 'Erro ao criar o projeto.' });
  }
};

export const getProjects = async (req: any, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.user.id },
    });
    res.status(200).json(projects);
  } catch (error) {
    console.error('Erro ao buscar projetos:', error);
    res.status(500).json({ error: 'Erro ao buscar projetos.' });
  }
};
