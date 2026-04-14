import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { connectToDB } from './database';

import chatRoutes from './routes/chat';
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import resourceRoutes from './routes/resources';

// Define the port and check to ensure that it is properly read from .env.
if (!process.env.PORT) {
    console.error('There was an issue assigning the PORT constant a value during server setup.')
    console.error('Please ensure that the .env file in /server/ is present and contains up-to-date information.')
    process.exit(1)
}

const PORT = process.env.PORT;

// Set up our Express app.
const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Define routing.
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);

// Attempt to connect to database and then listen for requests.
connectToDB().then( () => {
    app.listen(PORT, () => {
        console.log(`The server is now online at http://localhost:${PORT}`);
    });
});