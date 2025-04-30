const { Role } = require("../models/RoleModel.js");
const mongoose = require("mongoose");

// Create a new role
const createRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;

    // Check if role with the same name already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({
        message: "Role with this name already exists",
        field: "name"
      });
    }

    const newRole = new Role({
      name,
      description: description || "",
      permissions: permissions || []
    });

    const savedRole = await newRole.save();

    res.status(201).json({
      message: "Role created successfully",
      role: savedRole
    });
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({
      message: "Error creating role",
      error: error.message
    });
  }
};

// Get all roles
const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find({ isActive: true });
    res.status(200).json({ roles });
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({
      message: "Error fetching roles",
      error: error.message
    });
  }
};

// Get role by ID
const getRoleById = async (req, res) => {
  try {
    const { roleId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(roleId)) {
      return res.status(400).json({ message: "Invalid role ID" });
    }

    const role = await Role.findById(roleId);

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json({ role });
  } catch (error) {
    console.error("Error fetching role:", error);
    res.status(500).json({
      message: "Error fetching role",
      error: error.message
    });
  }
};

// Update role
const updateRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { name, description, permissions, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(roleId)) {
      return res.status(400).json({ message: "Invalid role ID" });
    }

    // Check if another role with the same name exists
    if (name) {
      const existingRole = await Role.findOne({ 
        name, 
        _id: { $ne: roleId } 
      });
      
      if (existingRole) {
        return res.status(400).json({
          message: "Another role with this name already exists",
          field: "name"
        });
      }
    }

    const updatedRole = await Role.findByIdAndUpdate(
      roleId,
      {
        name,
        description,
        permissions,
        isActive
      },
      { new: true, runValidators: true }
    );

    if (!updatedRole) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json({
      message: "Role updated successfully",
      role: updatedRole
    });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({
      message: "Error updating role",
      error: error.message
    });
  }
};

// Delete (deactivate) role
const deleteRole = async (req, res) => {
  try {
    const { roleId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(roleId)) {
      return res.status(400).json({ message: "Invalid role ID" });
    }

    // Instead of deleting, we set isActive to false
    const deactivatedRole = await Role.findByIdAndUpdate(
      roleId,
      { isActive: false },
      { new: true }
    );

    if (!deactivatedRole) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json({
      message: "Role deactivated successfully",
      role: deactivatedRole
    });
  } catch (error) {
    console.error("Error deactivating role:", error);
    res.status(500).json({
      message: "Error deactivating role",
      error: error.message
    });
  }
};

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole
};