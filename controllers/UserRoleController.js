const { Auth } = require("../models/AuthModel.js");
const { Role } = require("../models/RoleModel.js");
const mongoose = require("mongoose");

// Assign role to user
const assignRoleToUser = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(roleId)) {
      return res.status(400).json({ message: "Invalid user ID or role ID" });
    }

    // Check if user exists
    const user = await Auth.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if role exists and is active
    const role = await Role.findOne({ _id: roleId, isActive: true });
    if (!role) {
      return res.status(404).json({ message: "Role not found or inactive" });
    }

    // Check if user already has this role
    if (user.roles.includes(roleId)) {
      return res.status(400).json({ message: "User already has this role" });
    }

    // Add role to user
    user.roles.push(roleId);
    await user.save();

    res.status(200).json({
      message: "Role assigned to user successfully",
      userId: user.userId,
      roleId: role._id,
      roleName: role.name
    });
  } catch (error) {
    console.error("Error assigning role to user:", error);
    res.status(500).json({
      message: "Error assigning role to user",
      error: error.message
    });
  }
};

// Remove role from user
const removeRoleFromUser = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(roleId)) {
      return res.status(400).json({ message: "Invalid user ID or role ID" });
    }

    // Check if user exists
    const user = await Auth.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has this role
    if (!user.roles.includes(roleId)) {
      return res.status(400).json({ message: "User does not have this role" });
    }

    // Remove role from user
    user.roles = user.roles.filter(role => role.toString() !== roleId);
    await user.save();

    res.status(200).json({
      message: "Role removed from user successfully",
      userId: user.userId,
      roleId
    });
  } catch (error) {
    console.error("Error removing role from user:", error);
    res.status(500).json({
      message: "Error removing role from user",
      error: error.message
    });
  }
};

// Get all roles for a user
const getUserRoles = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await Auth.findOne({ userId }).populate('roles');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      userId: user.userId,
      email: user.email,
      roles: user.roles
    });
  } catch (error) {
    console.error("Error fetching user roles:", error);
    res.status(500).json({
      message: "Error fetching user roles",
      error: error.message
    });
  }
};

// Get all users with a specific role
const getUsersByRole = async (req, res) => {
  try {
    const { roleId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(roleId)) {
      return res.status(400).json({ message: "Invalid role ID" });
    }

    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    const users = await Auth.find({ roles: roleId })
      .select('userId email')
      .populate('userId', 'personalInfo.firstName personalInfo.lastName');

    res.status(200).json({
      role: role.name,
      users: users.map(user => ({
        userId: user.userId._id,
        email: user.email,
        firstName: user.userId.personalInfo?.firstName,
        lastName: user.userId.personalInfo?.lastName
      }))
    });
  } catch (error) {
    console.error("Error fetching users by role:", error);
    res.status(500).json({
      message: "Error fetching users by role",
      error: error.message
    });
  }
};

module.exports = {
  assignRoleToUser,
  removeRoleFromUser,
  getUserRoles,
  getUsersByRole
};