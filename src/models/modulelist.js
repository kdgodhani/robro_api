"use strict";
const { Types, Schema, model } = require("mongoose");
// const moment = require("moment");

const moduleListSchema = new Schema(
  {
    module_name: {
      type: String,
      trim: true,
      unique: true,
    },
    module_path: {
      type: String,
      trim: true,
      unique: true,
    },
    component_name: {
      type: String,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = model("moduleList", moduleListSchema);
