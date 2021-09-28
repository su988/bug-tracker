import dotenv from 'dotenv';
import pkg from '@prisma/client';

const { PrismaClient } = pkg;
export const prisma = new PrismaClient();

dotenv.config();

export const { PORT } = process.env;
export const { JWT_SECRET } = process.env;
