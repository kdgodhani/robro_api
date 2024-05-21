"use strict";
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth");

const { createModuleSchema } = require("../validations/user.validation");

const {
  validateBody,
  validateParams,
} = require("../validations/joi.validator");

const {
  createModule,
  getAllModule,
} = require("../controllers/user.controller");

router.post(
  "/createModule",
  verifyToken,
  //   validateBody(createModuleSchema),
  createModule
);

router.get("/getAllModule", verifyToken, getAllModule);

module.exports = router;
