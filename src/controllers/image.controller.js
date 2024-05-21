"use strict";
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_TOKEN;
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY;
let userMaping = require("../constants/role.mapping");
const moduleList = require("../models/modulelist");
const user = require("../models/user");
const images = require("../models/image");

const addImages = async (req, res, next) => {
  try {
    const { imageData, description } = req.body;
    // let { role: userRole, id } = req.user;

    console.log(req.user, " req.user");

    console.log(req.body, "req.body");
    // if (role == "Admin") {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Admin Role not allowed",
    //     data: [],
    //   });
    // }

    // add images
    let addImages = await images.create({
      user_id: id,
      image_data: imageData,
      description: description,
    });

    // Return success response with created user data
    return res.status(201).json({
      success: true,
      message: "Data add successfully",
      data: addImages,
    });
  } catch (error) {
    console.log(error, "image.controller -> addImages");
    next(error);
  }
};

module.exports = {
  addImages,
};
