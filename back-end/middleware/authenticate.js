// supersecretpuff/back-end/middleware/authenticate.js

import jwt from 'jsonwebtoken';

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.sendStatus(401);
    }
  
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.userId = user.id;
      req.user = user;
      next();
    });
  };

export { authenticateJWT }
