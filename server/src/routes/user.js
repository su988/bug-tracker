import express from 'express';
import { getAllUsers } from '../controllers/user.js';
import authChecker from '../middlewares/authChecker.js';

const router = express.Router();

router.get('/', authChecker, getAllUsers);

export default router;
