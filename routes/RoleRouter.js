const express = require("express");
const router = express.Router();
const { 
  createRole, 
  getAllRoles, 
  getRoleById, 
  updateRole, 
  deleteRole 
} = require("../controllers/RoleController");
const { 
  assignRoleToUser, 
  removeRoleFromUser, 
  getUserRoles, 
  getUsersByRole 
} = require("../controllers/UserRoleController");
const { verifyToken, isAdmin, hasPermission,hasRole } = require("../middlewares/AuthMiddleware");



router.post("/api/create-role", verifyToken,isAdmin, createRole);
router.get("/api/roles", verifyToken,isAdmin, getAllRoles);
router.get("/api/roles/:roleId", verifyToken,isAdmin, getRoleById);
router.put("/api/roles/:roleId", verifyToken, isAdmin, updateRole);
router.delete("/api/role/:roleId", verifyToken, isAdmin, deleteRole);

router.post("/api/role/assign-role-to-user",assignRoleToUser);
router.post("/api/role/remove-role-from-user", verifyToken, isAdmin, removeRoleFromUser);
router.get("/api/role/get-user-role/:userId", verifyToken,isAdmin,getUserRoles);
router.get("/api/role/users-by-role/:roleId", verifyToken, isAdmin, getUsersByRole);

router.post("/hasrole-example", verifyToken, hasRole("manager"), (req, res) => {
    res.status(200).json({ message: "You can do it because you are manager" });
  });

router.post("/permission-example", verifyToken, hasPermission("manage_roles"), (req, res) => {
  res.status(200).json({ message: "You have permission to manage roles" });
});

module.exports = router;