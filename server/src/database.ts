import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || "";

export const connectToDB = async (): Promise<void> => {
    try {
        if (MONGO_URI == "") process.exit(1);

        console.log('Connecting to MongoDB cluster...')

        await mongoose.connect(MONGO_URI);

        console.log('A connection to the MongoDB cluster has been established.');
    } catch (error) {
        console.log('A connection could to MongoDB could not be established.')
        console.log('Please ensure that your IP has been whitelisted in the MongoDB project overview.');
        console.error(error);
        process.exit(1);
    }
};