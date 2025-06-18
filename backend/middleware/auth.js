const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto_jwt');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Por favor autentíquese' });
  }
}; 