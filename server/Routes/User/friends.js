const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const mongoose = require("mongoose");
// const userModal = require("../../Models/userModal");
// const { protect } = require("../../middleware/authMiddleware");
// const generateToken = require("../../Config/generateToken");
const friendModal = require("../../Models/friendModal");
const userModal = require("../../Models/userModal");

app.post("/new", async (request, response) => {
  try {
    const { from, to } = request.body;
    console.log("Request", from, to);
    const existingFriend = await friendModal.findOne({ friendId: from });
    if (existingFriend) {
      existingFriend.friendList.push(to);
      await existingFriend.save();
      return response.send("Friend request successfully");
    } else {
      const friendRequest = new friendModal({
        friendId: from,
        friendList: [to],
        status: "accepted",
      });
      await friendRequest.save();
      return response.send("Friend request successfully");
    }
  } catch (error) {
    response.send("Error occured in loging");
  }
});
app.post("/fetch", async (request, response) => {
  const { userId } = request.body;
  try {
    const user = await userModal.findById(userId).lean();
    console.log("User: ", user);
    const friendList = user.friends || [];
    const allDetails = await Promise.all(
      friendList.map(async (item) => {
        const receivedData = await userModal.findById(item).lean();
        console.log("Inside: ", receivedData);
        return receivedData;
      })
    );
    console.log("Final Data: ", allDetails);
    return response.send(allDetails);
  } catch (error) {
    return response.send(error);
  }
});

module.exports = app;
