import type { Request, Response } from 'express';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
  
    // validate here
    // look up in DB

    res.json({ token: 'placeholder-token' });
};

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // salt+hash password here
  // save to DB

  res.status(201).json({ message: 'User created' });
};