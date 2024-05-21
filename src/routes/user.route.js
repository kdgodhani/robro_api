"use strict";
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");

const {
  createUserSchema,
  userLoginSchema,
  userLogoutSchema,
} = require("../validations/user.validation");

const {
  validateBody,
  validateParams,
} = require("../validations/joi.validator");

const {
  userRegister,
  userLogin,
  userLogout,
  getAllUser,
  addImages,
} = require("../controllers/user.controller");

// const {  } = require("../controllers/image.controller");

const moduleList = require("../routes/modulelist.route");
router.use("/admin", moduleList);

router.post(
  "/register",
  verifyToken,
  validateBody(createUserSchema),
  userRegister
);

router.post("/login", validateBody(createUserSchema), userLogin);

router.post("/logout", verifyToken, userLogout);

router.get("/getAllUser", verifyToken, getAllUser);

// here image add controller
router.post("/addImages", verifyToken, addImages);

module.exports = router;
