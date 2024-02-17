const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    privateChat : [{By : mongoose.Schema.Types.ObjectId , messages : String }]
  },
  { timestamps: true }
);

const MessageModel = mongoose.model("Message", messageSchema);
module.exports = MessageModel;
