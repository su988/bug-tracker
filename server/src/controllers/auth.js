import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { JWT_SECRET } from '../utils/config.js';
import {
  registerValidation,
  loginValidation,
} from '../utils/validations/auth.js';
import prisma from '../lib/prisma.js';

export const registerUser = async (req, res) => {
  const { username, password } = req.body;
  const { errors, valid } = registerValidation(username, password);

  if (!valid) {
    return res.status(400).send({ message: Object.values(errors)[0] });
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  if (existingUser) {
    return res
      .status(401)
      .send({ message: `Username ${username} is already taken` });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = await prisma.user.create({
    data: {
      username,
      password: passwordHash,
    },
  });

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: '1h',
  });

  res.cookie('token', token, {
    httpOnly: true,
  });

  return res.redirect('/');
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const { errors, valid } = loginValidation(username, password);

  if (!valid) {
    return res.status(400).send({ message: Object.values(errors)[0] });
  }

  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  if (!user) {
    return res.status(401).send({ message: `User: '${username}' not found.` });
  }

  const credentialsValid = await bcrypt.compare(password, user.password);

  if (!credentialsValid) {
    return res.status(401).send({ message: 'Invalid credentials.' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: '1h',
  });

  res.cookie('token', token, {
    httpOnly: true,
  });

  return res.redirect('/');
};
