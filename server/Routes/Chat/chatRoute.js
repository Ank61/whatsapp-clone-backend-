const express = require("express");
const app = express();
const { protect } = require("../../middleware/authMiddleware");
const Chat = require("../../Models/chatModel");
const userModal = require("../../Models/userModal");

app.post("/new", protect, async (request, response) => {
  //Either find chats or create new chat with the requested user.ID 
  //If there exists a chat with this userID then return that.
  //If the chat does not exist then create new chat.d
  const { userId } = request.body;
  if (!userId) {
    console.log("UserId param not sent with request");
    return response.sendStatus(400);
  }
  //If chat exists with this user
  var isChat = await Chat.find({
    isGroupChat: false, //one on one chat
    $and: [
      { users: { $elemMatch: { $eq: request.user._id } } }, //logged in user
      { users: { $elemMatch: { $eq: userId } } }, //userId we have sent
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  //It will return all the latest messages and user inofrmation 
  //using populate function 
  isChat = await userModal.populate(isChat, {
    path: "latestMessage.sender",
    select: " email",
  });
  // will also return all the sender info from the message collection usin populate
  // We have final chat data here 
  if (isChat.length > 0) {
    //Only on result, no other exist with these twi user
    response.send(isChat[0]);
  } else {
    var chatData = {
      // otherwise create new chat
      chatName: "sender",
      isGroupChat: false,
      users: [request.user._id, userId],
    };
    // Save the new chat in db 
    try {
      const createdChat = await Chat.create(chatData);
      //chat created
      // now send it to the user and populate it with user info
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      response.status(200).json(FullChat);
    } catch (error) {
      response.status(400);
      throw new Error(error.message);
    }
  }
});

app.get("/fetch", protect, async (request, response) => {
  try {
    //Using protect we added user._id in request object
    //finding chats of the logged in user
    Chat.find({ users: { $elemMatch: { $eq: request.user._id } } })
      //we are populating the users array in the chatsModal.  
      .populate("users", "-password")
      //also populate the groupAdmin which also peresent in the chatsModal.
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      //Sort from new to old
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        result = await userModal.populate(result, {
          path: "latestMessage.sender",
          select: "username email",
        });
        response.status(200).send(result);
      });
  }
  catch (error) {
    response.status(400);
    throw new Error(error.message);
  }
})


module.exports = app;


