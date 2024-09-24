import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes'; // Rotas de usuários
import projectRoutes from './routes/projectRoutes'; // Rotas de projetos

dotenv.config(); // Carrega variáveis de ambiente

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors()); // Habilita CORS
app.use(express.json()); // Permite que o servidor processe JSON

// Rotas de usuários
app.use('/api/users', userRoutes);

// Rotas de projetos
app.use('/api/projects', projectRoutes);

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
