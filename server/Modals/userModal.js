const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username : {
        type : String,
        require : true,
        unique : true,
    },
    email : {
        type : String,
        require : true,
        unique : true,
    },
    password : {
        type : String,
        require : true 
    }
})
const userModal = mongoose.model("user",userSchema);
module.exports = userModal;