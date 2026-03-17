import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chat.ts';
import userRoutes from './routes/users.ts';
import authRoutes from './routes/auth.ts';

const app = express();
const PORT = 8000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});