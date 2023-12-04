const express = require("express");
const bcrypt = require('bcrypt');
const app = express();
const mongoose = require("mongoose")
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
                status: 'accepted'
            });
            await friendRequest.save();
            return response.send("Friend request successfully");
        }
    }
    catch (error) {
        response.send("Error occured in loging");
    }
})
app.post("/fetch", async (request, response) => {
    const { userId } = request.body;
    const result = await friendModal.find({ friendId: userId });
    const friendList = result[0].friendList;
    try {
        const friendDetails = await userModal.find({
            _id: { $in: [...friendList] }
        });
        return response.send(friendDetails)
    } catch (error) {
        return response.send(error)
    }
})

module.exports = app;