import type { Request, Response } from 'express';
import { UserModel } from '../models/User';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
  
    // validate here
    // look up in DB

    res.json({ token: 'placeholder-token' });
};

export const register = async (req: Request, res: Response) => {
    const { username, email,
            password, // salt+hash
            firstName, lastName
          } = req.body;

    try {
        // https://www.mongodb.com/docs/manual/reference/method/db.collection.countdocuments/
        const userCount = await UserModel.countDocuments();

        const newUser = new UserModel({
            userId:     userCount + 1,
            username,   email,
            firstName,  lastName,
            conversations: [],
        });

        await newUser.save();

        res.status(200).json({ message: 'User created', userId: newUser.userId });
    
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
};