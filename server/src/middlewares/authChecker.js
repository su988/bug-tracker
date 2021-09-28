import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/config.js';

const authChecker = (req, res, next) => {
  const token = req.cookies.token;
  try {
    const user = jwt.verify(token, JWT_SECRET);

    if (!user.id) {
      return res
        .status(401)
        .send({ message: 'Token verification failed. Authorization denied.' });
    }

    req.userId = user.id;
    next();
  } catch (error) {
    res.clearCookie('token');
    res.status(500).send({ message: error.message });
  }
};

export default authChecker;
