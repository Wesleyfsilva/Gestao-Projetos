import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authenticateToken = (req: any, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    console.log('Token não fornecido');
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const verified = jwt.verify(token, secret);
    req.user = verified;
    console.log('Token verificado, usuário autenticado:', req.user); // Adiciona log para verificar se o token é verificado
    next();
  } catch (error) {
    console.log('Erro ao verificar o token:', error);
    res.status(401).json({ message: 'Token inválido.' });
  }
};

export default authenticateToken;
