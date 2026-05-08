const { verifyToken } = require('../utils/jwt');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
     
    const decoded = verifyToken(token);

    req.user = decoded; 

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
const allowRoles = (...roles) => {
  return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
          return res.status(403).json({
              message: "Forbidden: insufficient permissions"
          });
      }
      next();
  };
};

module.exports = {authMiddleware , allowRoles}