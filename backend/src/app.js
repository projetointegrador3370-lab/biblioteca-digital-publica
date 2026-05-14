import express from 'express';
import cors from 'cors';

import booksRoutes from './routes/booksRoutes.js';
import adminBooksRoutes from './routes/adminBooksRoutes.js';
import categoriesRoutes from './routes/categoriesRoutes.js';
import ageGroupsRoutes from './routes/ageGroupsRoutes.js';
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import fileRoutes from './routes/fileRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API da Biblioteca Digital Pública funcionando.' });
});

app.use('/api/books', booksRoutes);
app.use('/api/admin/books', adminBooksRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/age-groups', ageGroupsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/files', fileRoutes);

export default app;