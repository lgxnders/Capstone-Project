import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

    const makeTokens = (user) => ({
    access:  jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '15m' }),
    refresh: jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' }),
});

export const register = async (req, res) => {
    const { username, email, password, password2, firstName, lastName } = req.body;
    if (password !== password2) return res.status(400).json({ error: "Passwords don't match" });
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ error: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ username, email, password: hashed, firstName, lastName });
    res.status(201).json({ user: { id: user.id, username, email }, tokens: makeTokens(user) });
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password)))
        return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ user: { id: user.id, username, email: user.email }, tokens: makeTokens(user) });
};

export const logout = (req, res) => {
    res.json({ message: 'Logout successful' });
};

export const profile = async (req, res) => {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    res.json(user);
};