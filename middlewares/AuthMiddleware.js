const { verifyAccessToken } = require('../services/TokenService');
const { Auth } = require("../models/AuthModel");
const { Role } = require("../models/RoleModel");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "No token provided" });
    }
    
    const accessToken = authHeader.split(' ')[1];
    
    const decoded = verifyAccessToken(accessToken);
 
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.expired) {
      return res.status(401).json({ message: "Token expired", expired: true });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Keep the original isAdmin for backward compatibility
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    // Check new roles array if present
    if (req.user.roles && Array.isArray(req.user.roles)) {
      const hasAdminRole = req.user.roles.some(role => role.name === 'admin');
      if (hasAdminRole) {
        return next();
      }
    }
    return res.status(403).json({ message: "Access denied: Admin privileges required" });
  }
};

// Updated middleware to check roles
const hasRole = (roleName) => {
  return async (req, res, next) => {
    try {
      // First check if user has the role in the token (for performance)
      if (req.user.roles && Array.isArray(req.user.roles)) {
        const hasRole = req.user.roles.some(role => role.name === roleName);
        if (hasRole) {
          return next();
        }
      }
      
      // Legacy check for backward compatibility
      if (roleName === 'admin' && req.user.role === 'admin') {
        return next();
      }

      // If not in token or for double-checking, query the database
      const auth = await Auth.findOne({ userId: req.user.userId }).populate('roles');
      
      if (!auth) {
        return res.status(404).json({ message: "User not found" });
      }

      const hasRequiredRole = auth.roles.some(role => role.name === roleName);

      if (hasRequiredRole) {
        return next();
      }

      return res.status(403).json({ message: `Role '${roleName}' is required for this action` });
    } catch (error) {
      console.error(`Role verification error for ${roleName}:`, error);
      res.status(500).json({ message: "Error verifying user role" });
    }
  };
};

// Updated middleware to check if user has a specific permission
const hasPermission = (permission) => {
  return async (req, res, next) => {
    try {
      // First check if user has the permission in the token (for performance)
      if (req.user.permissions && req.user.permissions.includes(permission)) {
        return next();
      }

      // Check permissions from roles in the token
      if (req.user.roles && Array.isArray(req.user.roles)) {
        const hasPermissionInToken = req.user.roles.some(role => 
          role.permissions && role.permissions.includes(permission)
        );
        if (hasPermissionInToken) {
          return next();
        }
      }

      // If not in token or for double-checking, query the database
      const auth = await Auth.findOne({ userId: req.user.userId }).populate('roles');
      
      if (!auth) {
        return res.status(404).json({ message: "User not found" });
      }

      const hasRequiredPermission = auth.roles.some(role => 
        role.permissions && role.permissions.includes(permission)
      );

      if (hasRequiredPermission) {
        return next();
      }

      return res.status(403).json({ message: `Permission '${permission}' is required for this action` });
    } catch (error) {
      console.error(`Permission verification error for ${permission}:`, error);
      res.status(500).json({ message: "Error verifying user permission" });
    }
  };
};

module.exports = {
  verifyToken,
  isAdmin,
  hasRole,
  hasPermission
};