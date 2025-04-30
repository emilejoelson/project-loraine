const bcrypt = require("bcryptjs");
const { Auth } = require("../models/AuthModel.js");
const { User } = require("../models/UserModel.js");
const {
  generateTokens,
  saveRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken
} = require('../services/TokenService');
const {
  setRefreshTokenCookie,
  clearRefreshTokenCookie
} = require('../services/CookieService');


const signup = async (req,res) => {
  try {
    const {
      email,
      password,
      confirmPassword,
      profileImage, 
      personalInfo,
      professionalInfo,
      academicInfo
    } = req.body;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Passwords do not match", field: "confirmPassword" });
    }

    const existingAuth = await Auth.findOne({ email });
    if (existingAuth) {
      return res
        .status(400)
        .json({ message: "Email already registered", field: "email" });
    }

    // Create the user with the profile image URL
    const newUser = new User({
      profileImage: profileImage || null, // Store the URL/path directly
      personalInfo: {
        civility: personalInfo.civility,
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        email: email,
        telephone: personalInfo.telephone
      },
    });

    const savedUser = await newUser.save();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAuth = new Auth({
      email,
      password: hashedPassword,
      userId: savedUser._id,
      role: "user",
      refreshTokens: []
    });

    await newAuth.save();

    const { accessToken, refreshToken } = await generateTokens({
      userId: savedUser._id,
      email,
      role: "user",
      roles: [],
    });

    await saveRefreshToken(savedUser._id, refreshToken);

    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      message: "User registered successfully",
      userId: savedUser._id,
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error("Error during signup:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already registered",
        field: "email",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({
      message: "Error during signup",
      error: error.message,
    });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const auth = await Auth.findOne({ email }).populate('roles');
    
    if (!auth) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    const isPasswordValid = await bcrypt.compare(password, auth.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = await generateTokens({
      userId: auth.userId,
      email: auth.email,
      role: auth.role,
      roles: auth.roles
    });

    await saveRefreshToken(auth.userId, refreshToken);

    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      message: "Login successful",
      userId: auth.userId,
      role: auth.role,
      roles: auth.roles.map(role => ({ id: role._id, name: role.name })),
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      message: "Error during login",
      error: error.message,
    });
  }
};

const refreshTokens = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }

    const auth = await Auth.findOne({
      userId: decoded.userId,
      "refreshTokens.token": refreshToken,
      "refreshTokens.isRevoked": false,
      "refreshTokens.expires": { $gt: new Date() }
    }).populate('roles');

    if (!auth) {
      return res.status(401).json({ message: "Refresh token invalid or revoked" });
    }

    await revokeRefreshToken(refreshToken);

    const { accessToken, refreshToken: newRefreshToken } = await generateTokens({
      userId: auth.userId,
      email: auth.email,
      role: auth.role,
      roles: auth.roles
    });

    await saveRefreshToken(auth.userId, newRefreshToken);

    setRefreshTokenCookie(res, newRefreshToken);

    res.status(200).json({
      accessToken,
      refreshToken: newRefreshToken,
      message: "Tokens refreshed successfully"
    });
  } catch (error) {
    console.error("Error refreshing tokens:", error);
    res.status(500).json({
      message: "Error refreshing tokens",
      error: error.message,
    });
  }
};
const getProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const profileData = {
      email: user.personalInfo.email,
      profileImage: user.profileImage,
      firstName: user.personalInfo.firstName,
      lastName: user.personalInfo.lastName,
    };
    
    return res.status(200).json(profileData);
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    return res.status(500).json({
      message: "Error retrieving user profile",
      error: error.message,
    });
  }
};
const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    clearRefreshTokenCookie(res);

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({
      message: "Error during logout",
      error: error.message,
    });
  }
};

module.exports = {
  signup,
  login,
  refreshTokens,
  logout,
  getProfile,
};