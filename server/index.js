import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './models/index.js';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';

dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRoutes);   // api/auth/ register login logout
app.use('/api/chat', chatRoutes);   // api/chat

sequelize.authenticate()
    .then(() => console.log('DB connected'))
    .catch(err => console.error('DB error:', err));

app.listen(process.env.PORT || 8000, () =>
    console.log(`Server running on port ${process.env.PORT || 8000}`)
);