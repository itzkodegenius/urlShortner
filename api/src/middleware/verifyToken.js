import jwt from 'jsonwebtoken';
import { User } from '../models/userSchema.js';

export const verifyToken = async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.headers.authorization.replace('Bearer ', ' ');

    if (!token) {
      return res.status(401).json({
        message: 'No token provided',
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded ::>>>>", decoded);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        message: 'Invalid token',
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: 'Invalid token',
    });
  }
};
