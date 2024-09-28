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
  const profilePic = req.file ? req.file.filename : null; // Verifica se o arquivo foi enviado

  try {
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

// Servir arquivos estáticos da pasta "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
