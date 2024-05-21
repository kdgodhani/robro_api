"use strict";
const { Types, Schema, model } = require("mongoose");
// const moment = require("moment");

const imageSchema = new Schema(
  {
    user_id: {
      type: Types.ObjectId,
      ref: "User",
      //   required: true,
    },
    image_data: {
      type: Array,
      //   required: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = model("image", imageSchema);
