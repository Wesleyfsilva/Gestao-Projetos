import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes'; // Importa as rotas de usuários
import projectRoutes from './routes/projectRoutes'; // Importa as rotas de projetos

dotenv.config(); // Carrega variáveis de ambiente do arquivo .env

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json()); // Permite que o servidor processe JSON

// Rotas de usuários
app.use('/api/users', userRoutes);

// Rotas de projetos
app.use('/api', projectRoutes); 

// Inicia o servidor
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
