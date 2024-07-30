  import jwt from 'jsonwebtoken';

  const authMiddleware = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization.replace(`Bearer `, ' ')
    if (!token) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      req.user = user;
      next();
    });
  };

  export default authMiddleware;
      