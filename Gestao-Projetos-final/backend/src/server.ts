import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import multer from 'multer';
import { PrismaClient } from '@prisma/client'; // Importa o Prisma Client
import bcrypt from 'bcryptjs'; // Para hash da senha

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
const prisma = new PrismaClient(); // Inicializa o Prisma Client

// Middlewares
app.use(cors());
app.use(express.json());

// Configuração do multer para armazenar imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Define a pasta onde as imagens serão armazenadas
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Gera um nome único para o arquivo
  },
});

const upload = multer({ storage });

// Rota de registro de usuário com upload de foto de perfil
app.post('/api/users/register', upload.single('profilePic'), async (req, res) => {
  const { name, email, password } = req.body;
  const profilePic = req.file ? req.file.filename : null;

  try {
    // Verifica se o email já está cadastrado
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    // Hash da senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);
    // Salva o usuário no banco de dados com o Prisma
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // Salva a senha criptografada
        imageUrl: profilePic ? `/uploads/${profilePic}` : null, // Armazena o caminho da foto
      },
    });

    res.json({
      message: 'Usuário registrado com sucesso',
      user,
    });

  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
});


// Rota de login do usuário
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(`Email recebido: ${email}`);
  console.log(`Password recebido: ${password}`);

  try {
    // Busca o usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email },
    });
    console.log('Usuário encontrado:', user);

    if (!user) {
      return res.status(400).json({ message: 'Email ou senha inválidos' });
    }

    // Compara a senha fornecida com a hash salva no banco de dados
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Senha válida:', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Email ou senha inválidos' });
    }

    // Se a autenticação for bem-sucedida
    res.json({ message: 'Login bem-sucedido', user });

  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
});


// Servir arquivos estáticos da pasta "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
