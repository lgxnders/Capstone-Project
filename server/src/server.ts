import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { connectToDB } from './database.ts';

import chatRoutes from './routes/chat.ts';
import userRoutes from './routes/users.ts';
import authRoutes from './routes/auth.ts';

const app = express();
const PORT = process.env.PORT;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// defined routes
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/auth', authRoutes);

// connect to database then listen for connection
connectToDB().then( () => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
});