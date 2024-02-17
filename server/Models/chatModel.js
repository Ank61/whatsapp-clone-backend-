const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const chatSchema = new Schema(
  {
    chatName: {
      type: String,
      enum: ["private", "group"],
    },
    users: [{ type: mongoose.Schema.Types.ObjectId }],
    messages: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
        },
        message: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const chatsModal = mongoose.model("chat", chatSchema);
module.exports = chatsModal;
