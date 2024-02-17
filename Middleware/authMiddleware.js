const jwt = require("jsonwebtoken");
const userModal = require("../Models/userModal");
const asyncHandler = require("express-async-handler");
const protect = asyncHandler(async (request, response, next) => {
    let token;
    if (request.headers.authorization && request.headers.authorization.startsWith("Bearer")) {
        try {
            token = request.headers.authorization.split(" ")[1];
            //giving us only token
            const decodes = jwt.verify(token, process.env.JWT_SECRET);
            //create user variable inside of the request
            request.user = await userModal.findById(decodes.id).select("-password");
            //will return all the infor of that decoded is and will remove the password from it.
            next();  //next operation that is the second callback.
        }
        catch (error) {
            throw new Error("Not Authorized, token failed");
        }
    }
    if(!token){
        response.status(401);
        throw new Error("Not authorized, no token");
    }
})
module.exports = {protect};