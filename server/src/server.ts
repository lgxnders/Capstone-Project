import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { connectToDB } from './database';

import chatRoutes from './routes/chat';
import userRoutes from './routes/users';
import authRoutes from './routes/auth';

// Define the port and check to ensure that it is properly read from .env.
let PORT;
try {
    PORT = process.env.PORT;

    if (PORT === undefined) throw new Error("Port is undefined.")

} catch (err) {
    console.log('There was an issue assigning the PORT constant a value during server setup.')
    console.log('Please ensure that the .env file in /server/ is present and contains up-to-date information.')
    process.exit(1)
}

// Set up our Express app.
const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Define routing.
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/auth', authRoutes);

// Attempt to connect to database and then listen for requests.
connectToDB().then( () => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
});