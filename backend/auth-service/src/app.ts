import express from 'express';
import authRoutes from './routes/authRoutes';
import cors from 'cors';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use('/login', authRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});