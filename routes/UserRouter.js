const express = require("express");
const routerUser = express.Router();
const userController = require("../controllers/UserController");
const { verifyToken } = require("../middlewares/AuthMiddleware");
const { profileImageMiddleware } = require("../utils/fileUpload");

routerUser.get("/api/getusers", userController.getUsers);
routerUser.post(
  "/api/upload-profile-image",
  profileImageMiddleware,
  userController.uploadProfileImage
);

module.exports = routerUser;
