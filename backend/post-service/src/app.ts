import express from 'express';
import PostRoutes from './routes/PostRoutes';
import cors from 'cors';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use('/posts', PostRoutes);

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});