const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Auth } = require("../models/AuthModel.js");

const ACCESS_TOKEN_EXPIRY = '15m'; 
const REFRESH_TOKEN_EXPIRY = '7d'; 
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; 

const generateTokens = async (user) => {
  // If user is an Auth document, populate roles if not already populated
  let userRoles = [];
  if (user.roles) {
    if (typeof user.roles[0] === 'object') {
      // Roles already populated
      userRoles = user.roles.map(role => ({
        id: role._id.toString(),
        name: role.name
      }));
    } else {
      // Need to populate roles
      const authUser = await Auth.findOne({ userId: user.userId || user._id })
        .populate('roles')
        .exec();
      
      if (authUser && authUser.roles) {
        userRoles = authUser.roles.map(role => ({
          id: role._id.toString(),
          name: role.name
        }));
      }
    }
  }

  const accessToken = jwt.sign(
    { 
      userId: user.userId || user._id, 
      email: user.email, 
      role: user.role, // Keep for backward compatibility
      roles: userRoles  // Add the roles array
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { 
      userId: user.userId || user._id, 
      email: user.email,
      tokenId: crypto.randomBytes(16).toString('hex') 
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  return { accessToken, refreshToken };
};

const saveRefreshToken = async (userId, refreshToken) => {
  try {
    const auth = await Auth.findOne({ userId });
    
    if (!auth) {
      throw new Error("User not found");
    }
    
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + REFRESH_TOKEN_EXPIRY_MS);

    auth.refreshTokens.push({
      token: refreshToken,
      expires: expiryDate,
      isRevoked: false
    });
    
    // Remove expired tokens
    auth.refreshTokens = auth.refreshTokens.filter(token => 
      token.expires > new Date() && !token.isRevoked
    );
    
    await auth.save();
  } catch (error) {
    console.error("Error saving refresh token:", error);
    throw error;
  }
};


const verifyRefreshToken = (refreshToken) => {
  try {
    return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};


const verifyAccessToken = (accessToken) => {
  try {
    return jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      const err = new Error("Token expired");
      err.expired = true;
      throw err;
    }
    throw new Error("Invalid token");
  }
};


const revokeRefreshToken = async (refreshToken) => {
  const auth = await Auth.findOne({ "refreshTokens.token": refreshToken });
  if (auth) {
    const tokenIndex = auth.refreshTokens.findIndex(t => t.token === refreshToken);
    if (tokenIndex !== -1) {
      auth.refreshTokens[tokenIndex].isRevoked = true;
      await auth.save();
    }
  }
};

module.exports = {
  generateTokens,
  saveRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
  revokeRefreshToken,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY_MS
};