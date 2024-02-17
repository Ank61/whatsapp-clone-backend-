const MessageModel = require("../Models/messageModel");
const mongoose = require("mongoose")

const insertChat = async (chatId, senderId, message) => {
  const senderObject = {
    By: senderId,
    messages: message,
  };

  try {
    const result = await MessageModel.updateOne(
      { _id: chatId || new mongoose.Types.ObjectId() },
      { $push: { privateChat: senderObject } },
      { upsert: true },
      (error, result) => {
        if (error) {
          console.error("Error updating document:", error);
        } else {
          console.log("Document updated successfully:", result);
        }
      }
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = insertChat;
