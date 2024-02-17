const express = require("express");
const Chat = require("../../Models/chatModel");
const userGroup = require("../../Models/userModal");
const { protect } = require("../../Middleware/authMiddleware");
const { response } = require("../Chat/chatRoute");
const app = express();

app.post("/new", protect, async (request, response) => {
    //Requires chat name and all the user to be included in.
    //We can search the user and add them in the grouop
    try {
        if (!request.body.name || !request.body.users) {
            return response.status(400).send
        }
        var users = JSON.parse(req.body.users); //send in string format from frontend
        if (users.length > 2) {
            return response.status(400).send("More than 2 users are required");
        }
        users.push(req.user);  //also add the looged in user
        const groupchat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user, //that have been logged in
        });
        const fullGroupChat = await Chat.findOne({ _id: groupchat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password"); //to again create a reponse from API to populate all the data frontend.
        response.status(200).json(fullGroupChat);
    } catch (error) {
        response.status(400);
        throw new Error(error.message);
    }
})

module.exports = app;