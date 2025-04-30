const { User } = require("../models/UserModel.js");
const fs = require("fs");
const path = require("path");



const uploadProfileImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const filePath = req.file.path;
    if (req.body.userId) {
      const user = await User.findById(req.body.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (user.profileImage) {
        const oldImagePath = path.resolve(__dirname, "../", user.profileImage);
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
          } catch (err) {
            console.error("Error deleting old profile image:", err);
          }
        }
      }
      
      // Update the user's profile image
      user.profileImage = filePath;
      await user.save();
    }

    return res.status(200).json({
      message: "Profile image uploaded successfully",
      filePath: filePath,
    });
  } catch (error) {
    console.error("Error uploading profile image:", error);
    res.status(500).json({ message: "Error uploading profile image", error: error.message });
  }
};





const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filter = {};

    // Add optional filters
    if (req.query.desiredPosition) {
      filter.desiredPosition = new RegExp(req.query.desiredPosition, "i");
    }
    if (req.query.desiredRegion) {
      filter.desiredRegion = new RegExp(req.query.desiredRegion, "i");
    }

    const users = await User.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(); // Convert to plain JavaScript objects

    const total = await User.countDocuments(filter);

    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
};

module.exports = {
  getUsers,
  uploadProfileImage,
};
