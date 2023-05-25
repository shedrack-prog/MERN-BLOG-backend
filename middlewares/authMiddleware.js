const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeaders = req.headers.authorization;

  if (!authHeaders || !authHeaders.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not logged in' });
  }

  const token = authHeaders.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(payload);
    req.user = { userId: payload.userId, username: payload.username };
    // console.log(user);
    next();
  } catch (error) {
    res.status(500).json({ message: 'Authentication Invalid' });
  }
};

module.exports = authMiddleware;
