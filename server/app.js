import express, { json } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './src/routes/auth.js';
import { PORT } from './src/utils/config.js';

const app = express();

app.use(cors());
app.use(json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello tanya!');
});

app.use('/', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
