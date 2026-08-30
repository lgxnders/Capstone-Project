import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const MONGO_URI = process.env.MONGO_URI || "";

export const connectToDB = async (): Promise<void> => {
    try {
        if (MONGO_URI !== "") {
            console.log('Connecting to MongoDB cluster...')
            await mongoose.connect(MONGO_URI);
            console.log('A connection to the MongoDB cluster has been established.');
            return;
        }
    } catch (error) {
        console.log('A connection to MongoDB could not be established.')
        console.error(error);
    }

    try {
        console.log('Initializing in-memory MongoDB cluster...');
        const mongoServer = await MongoMemoryServer.create();
        const memoryUri = mongoServer.getUri();
        await mongoose.connect(memoryUri);
        console.log('Falling back to in-memory database. Data will be lost on restart.');
    } catch (memError) {
        console.error('Failed to initialize in-memory database:', memError);
        process.exit(1);
    }
};