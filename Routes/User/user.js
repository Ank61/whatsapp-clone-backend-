const express = require("express");
const bcrypt = require('bcrypt');
const app = express();
const userModal = require("../../Models/userModal");
const { protect } = require("../../Middleware/authMiddleware");
const generateToken = require("../../Config/generateToken");
const friendModal = require("../../Models/friendModal");

app.post("/login", async (request, response) => {
    try {
        const { username, password } = request.body;
        const fetchUser = await userModal.find({ username })
        bcrypt.compare(password, fetchUser[0].password, async (err, result) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return response.send("Login failed")
            }
            if (result) {
                response.json({
                    _id: fetchUser[0]._id,
                    username: fetchUser[0].username,
                    email: fetchUser[0].email,
                    token: generateToken(fetchUser[0]._id),
                })
            } else {
                response.status(401).send("Login Failed")
            }
        });
    }
    catch (error) {
        console.log("Error occured in login", error);
        response.send("Error occured in loging");
    }
})


// to get particular user from the userRoute
//  /user?search=piyush&lastname=agarwal =>{search : piyush, lastname : agarwal}

app.get("/", protect, async (request, response) => {
    const keyword = request.query.search ? {
        $or: [
            { name: { $regex: request.query.search, $options: "i" } },
            { email: { $regex: request.query.search, $options: "i" } }
        ],
    } : {};
    const user = await userModal.find(keyword)
    // .find({_id : {$ne :  request.user._id }});
    //Do not send logged in users itself inside user searched result
    response.send(user)
})

app.post("/new", async (request, response) => {
    try {
        const { username, email, password } = request.body;

        const existingUser = await userModal.findOne({ email });

        if (existingUser) {
            // Email already exists, return an error response
            return response.status(409).send("Email already in use");
        }

        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, async (err, salt) => {
            if (err) {
                console.error('Error generating salt:', err);
                return response.status(500).send("Error occurred while creating the user 1");
            }
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) {
                    console.error('Error hashing password:', err);
                    return response.status(500).send("Error occurred while creating the user2");
                }
                const newUser = new userModal({
                    username: username,
                    email: email,
                    password: hash
                })

                try {
                    await newUser.save();
                    response.send("User created successfully");
                } catch (error) {
                    console.error('Error saving user:', error);
                    response.status(500).send("Error occurred while creating the user");
                }
            });
        });
    } catch (error) {
        console.log("Error occurred in the post API user", error);
        response.status(500).send("Error occurred while posting user");
    }
});

// app.post("/delete",async (request, response)=>{
// const {email} =request.body;
// try{
// const responseData = userModal.deleteOne({ email }).catch(err=>console.log(err))
// if(responseData.deleteCount>0){
//   response.send("User Deleted Successfully");
// }
// else{
//   response.send("Error occured");
// }
// }
// catch(err){
//   response.send("Error occured eleting user");
// };
// });

module.exports = app;