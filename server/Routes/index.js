const userRoutes = require("../Routes/User/user");
const chatRoutes = require("../Routes/Chat/chatRoute");

function setupRoutes(app) {
  app.use('/user', userRoutes);
  app.use('/chat', chatRoutes);
}

module.exports = setupRoutes;