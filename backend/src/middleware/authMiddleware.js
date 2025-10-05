const jwt = require('jsonwebtoken');
const { getUserModel } = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const UserModel = getUserModel();
    const dbType = process.env.DB_TYPE || 'mongodb';
    
    let user;
    if (dbType === 'mongodb') {
      user = await UserModel.findById(decoded.id).select('-password').lean();
    } else {
      user = await UserModel.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });
      if (user) user = user.toJSON();
    }
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const ownerOnly = (req, res, next) => {
  if (req.user.role !== 'owner') {
    return res.status(403).json({ message: 'Access denied. Owner only.' });
  }
  next();
};

module.exports = { authMiddleware, ownerOnly };
