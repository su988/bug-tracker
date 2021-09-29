import dotenv from 'dotenv';

dotenv.config();

export const { PORT } = process.env;
export const { JWT_SECRET } = process.env;
