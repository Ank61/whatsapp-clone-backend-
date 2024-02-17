const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const friendsSchema = new Schema({
    friendId : {type : mongoose.Schema.Types.ObjectId},
    friendList : [{type : mongoose.Schema.Types.ObjectId}],
    status: { type: String, default: "accepted" }
})
const friendModal = mongoose.model("friend", friendsSchema);
module.exports = friendModal;