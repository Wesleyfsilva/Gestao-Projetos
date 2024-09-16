import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import authenticateToken from '../middleware/authMiddleware'; // Importando o middleware de autenticação

const prisma = new PrismaClient();
const userRoutes = Router();

// Rota para cadastro de usuários
userRoutes.post('/register', async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    // Verificar se o usuário já existe
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar novo usuário
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao cadastrar o usuário.' });
  }
});

// Rota para login de usuários
userRoutes.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    // Verificar a senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Senha inválida' });
    }

    // Gerar o token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login.' });
  }
});

// Rota para criar um novo projeto
userRoutes.post('/projects', authenticateToken, async (req: any, res: Response) => {
  const { name, description, status, dueDate } = req.body;

  try {
    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        status,
        dueDate,
        userId: req.user.id, 
      },
    });

    res.json(newProject);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar o projeto.' });
  }
});

export default userRoutes;
