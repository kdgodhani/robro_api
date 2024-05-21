"use strict";
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_TOKEN;
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY;
// let userMaping = require("../constants/role.mapping");
const moduleList = require("../models/modulelist");
const user = require("../models/user");
const images = require("../models/image");

const bcrypt = require("bcryptjs");
// let { encryptData, decryptData } = require("../utils/encrypt");

const userRegister = async (req, res, next) => {
  try {
    let { firstName, email, lastName, password, role, moduleList } = req.body;
    // Mannually entry in mongodb

    // first_name : "admin"
    // last_name : "user"
    // email : "admin@robro.com"
    // password : "$2a$10$eL9Tbhw2YJ3sOoEKLvcYC.aalfT/NKmeiBnuvHVsPhg7lPHmjU.ZK"  // Admin@123
    // role:"Admin"

    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: "Admin Use Role Not Found !!",
        data: [],
      });
    }

    let { role: userRole } = req.user;

    // Check if the user making the request is an Admin
    if (!userRole || (userRole && userRole !== "Admin")) {
      return res.status(403).json({
        success: false,
        message: "Only Admin Can Create User !!",
        data: [],
      });
    }

    // Check if the user already exists
    let checkUser = await user.findOne({ email: email });
    if (checkUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
        data: [],
      });
    }

    if (role == "Admin") {
      return res.status(400).json({
        success: false,
        message: "Admin Role not allowed",
        data: [],
      });
    }

    // Encrypt the password
    let encryptPassword = await bcrypt.hash(password, 10);

    // Create the new user
    let createUser = await user.create({
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: encryptPassword,
      role: role,
      module_list: moduleList,
    });

    // Return success response with created user data
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: createUser,
    });
  } catch (error) {
    console.log(error, "user.controller -> userRegister");
    next(error);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const checkUser = await user.findOne({ email });
    if (!checkUser) {
      return res.status(400).json({
        success: false,
        message: "User is Not Found",
      });
    }

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, checkUser.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    let finalData = [];
    const token = jwt.sign(
      { id: checkUser._id, email: checkUser.email, role: checkUser.role },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    let userRoleMapObj = {};
    let objRole = [{ role_name: checkUser.role }];
    userRoleMapObj.obj_role = objRole;
    // let objModule = userMaping[checkUser.role];

    userRoleMapObj.obj_module = [];

    if (checkUser && checkUser["module_list"].length > 0) {
      const moduleDetailsPromises = checkUser.module_list.map(
        async (moduleId) => {
          const moduleDetail = await moduleList
            .findById(moduleId)
            .lean()
            .exec();
          return moduleDetail;
        }
      );

      const modules = await Promise.all(moduleDetailsPromises);
      // remove null value
      const filteredModules = modules.filter((module) => module !== null);
      userRoleMapObj.obj_module = filteredModules ? filteredModules : [];
    }

    finalData.push({
      id: checkUser._id,
      email: checkUser.email,
      token: token,
      userRoleMap: userRoleMapObj,
    });

    // Return the token
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: finalData,
    });
  } catch (error) {
    console.log(error, "user.controller -> userLogin");
    next(error);
  }
};

const userLogout = async (req, res, next) => {
  try {
    throw { success: false, message: "just tyr ioror" };
  } catch (error) {
    console.log(error, "user.controller -> userLogout");
    next(error);
  }
};

const getAllUser = async (req, res, next) => {
  try {
    let { role: userRole } = req.user;

    // Check if the user making the request is an Admin
    if (!userRole || (userRole && userRole !== "Admin")) {
      return res.status(403).json({
        success: false,
        message: "Only Admin Can Get All User !!",
        data: [],
      });
    }
    const users = await user.find();

    // Return success response with modules data
    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.log(error, "user.controller -> getAllUser");
    next(error);
  }
};

// Here create module list api
const createModule = async (req, res, next) => {
  try {
    const { moduleName, modulePath, componentName } = req.body;

    let { role: userRole } = req.user;

    // We can also define Role condition IN route But Currently we are using here
    // Check if the user making the request is an Admin
    if (!userRole || (userRole && userRole !== "Admin")) {
      return res.status(403).json({
        success: false,
        message: "Only Admin Can Create Module !!",
        data: [],
      });
    }
    const newModule = await moduleList.create({
      module_name: moduleName,
      module_path: modulePath,
      component_name: componentName,
    });

    // Return success response
    return res.status(201).json({
      success: true,
      message: "Module created successfully",
      data: newModule,
    });
  } catch (error) {
    console.log(error, "user.controller -> createModule");
    next(error);
  }
};

const getAllModule = async (req, res, next) => {
  try {
    const modules = await moduleList.find();

    // Return success response with modules data
    return res.status(200).json({
      success: true,
      data: modules,
    });
  } catch (error) {
    console.log(error, "user.controller -> getAllModule");
    next(error);
  }
};

// images

const addImages = async (req, res, next) => {
  try {
    const { imageData, description } = req.body;
    let { role: userRole, id } = req.user;

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
  userRegister,
  userLogin,
  userLogout,
  getAllUser,
  createModule,
  getAllModule,
  addImages,
};
