"use strict";
const { Types, Schema, model } = require("mongoose");

const imageSchema = new Schema(
  {
    user_id: {
      //   type: Types.ObjectId,
      type: String,
      //   ref: "User",
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

module.exports = model("userImage", imageSchema);
