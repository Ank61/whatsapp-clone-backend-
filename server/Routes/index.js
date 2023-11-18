const userRoutes = require("../Routes/User/user");
const chatRoutes = require("../Routes/Chat/chatRoute");
const groupchat = require("../Routes/GroupChat/groupChat");

function setupRoutes(app) {
  app.use('/user', userRoutes);
  app.use('/chat', chatRoutes);
  app.use("/groupchat", groupchat);
}

module.exports = setupRoutes;