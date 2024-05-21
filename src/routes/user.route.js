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
} = require("../controllers/user.controller");

const moduleList = require("../routes/modulelist.route");
router.use("/admin", moduleList);

router.post(
  "/register",
  verifyToken,
  validateBody(createUserSchema),
  userRegister
);

router.post("/login", validateBody(createUserSchema), userLogin);

router.post("/logout", userLogout);

// router.post("/resetPassword", verifyToken, userResetPassword);

// router.post("/update/permission", verifyToken, userUpdatePermission);

// router.get("/getAllRole", authVerify, getRole);

// router.post("/createRole", authVerify, createRole);

// router.get("/getAllModule", authVerify, getModule);

// router.post(
//   "/insertUpdateModule",
//   authVerify,
//   validateBody(insertUpdateModuleSchema),
//   createModule
// );

// router.get("/getAllRolePermission", authVerify, getRolePermission);

// router.post(
//   "/insertUpdateRolePermission",
//   authVerify,
//   validateBody(insertUpdatePermissionSchema),
//   createRolePermission
// );

// router.post(
//   "/insertUpdateRoleSetting",
//   authVerify,
//   validateBody(insertUpdateRoleSettingSchema),
//   insertUpdateRoleSetting
// );

// router.get("/getAllRoleSetting", authVerify, getRoleSetting);

// router.post(
//   "/insertUpdateRoleMapping",
//   authVerify,
//   validateBody(insertUpdateRoleMappingSchema),
//   insertUpdateRoleMapping
// );

// router.get("/getAllUserRoleMapping", authVerify, getRoleMapping);

module.exports = router;
