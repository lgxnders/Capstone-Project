import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || "";

export const connectToDB = async (): Promise<void> => {
    try {
        if (MONGO_URI == "") process.exit(1);

        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected.');
    } catch (error) {
        console.error('MongoDB connection failed.', error);
        process.exit(1);
    }
};