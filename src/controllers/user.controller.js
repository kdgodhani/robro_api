"use strict";
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_TOKEN;
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY;
let userMaping = require("../constants/role.mapping");
const moduleList = require("../models/modulelist");
const bcrypt = require("bcryptjs");
// let { encryptData, decryptData } = require("../utils/encrypt");

const userRegister = async (req, res, next) => {
  try {
    let { firstName, email, lastName, password, role } = req.body;
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
    let objModule = userMaping[checkUser.role];

    userRoleMapObj.obj_role = objRole;
    userRoleMapObj.obj_module = objModule ? objModule : [];

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

    // // Get user input
    // let { email, password } = req.body

    // let userArr = [{
    //   Id:1,
    //   Email:"admin@mail.com",
    //   Role:"Admin"
    // },
    // {
    //   Id:2,
    //   Email:"supervisor@mail.com",
    //   Role:"Supervisor"
    // },
    // {
    //   Id:3,
    //   Email:"worker@mail.com",
    //   Role:"Worker"
    // },]

    // // let getUser = userExist.recordset[0];
    // let getUser = findUserByEmail(userArr,email);

    // if(!getUser){
    //       return res.send({
    //     success: false,
    //     message: "\User Not Found in Db...",
    //   });
    // }

    // let finalData = [];

    // let userInfo = {
    //   userId: getUser.Id,
    //   email: getUser.Email,
    //   userRole: getUser.Role,
    // };

    // // let userInfoStringfy = JSON.stringify(userInfo);

    // let token = jwt.sign(userInfo, TOKEN_KEY, {
    //   expiresIn: TOKEN_EXPIRY,
    // });

    // let userRoleMapObj = {};

    // let objRole = [{ role_name: getUser.Role }];
    // let objModule = userMaping[getUser.Role];

    // userRoleMapObj.obj_role = objRole;
    // userRoleMapObj.obj_module = objModule ? objModule : [];

    // finalData.push({
    //   id: getUser.Id,
    //   email: getUser.Email,
    //   userToken: token,
    //   userRoleMap: userRoleMapObj,
    // });

    // return res.send({
    //   success: true,
    //   data: finalData,
    // });
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

module.exports = {
  userRegister,
  userLogin,
  userLogout,
  createModule,
  getAllModule,
};
