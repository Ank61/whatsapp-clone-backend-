const socketio = require("socket.io");
const insertChat = require("./../../Utils/common");

const socketService = (server) => {
  const io = socketio(server, { cors: { origin: "*" } });
  io.on("connection", (socket) => {
    socket.on("setup", (data) => {
      const { user } = data;
      socket.join(user);
      console.log(user, "connected");
    });
    socket.on("join chat", (room) => {
      socket.join(room);
    });
    socket.on("new message", async (newMessageRecieved) => {
      const { to, message,from,messageId } = newMessageRecieved;
      socket.in(to).emit("message recieved", newMessageRecieved);
      if(messageId){
      //if there is already one present then get the id of chat 
      //and update the message object


      }
      else{
        //create a new message object 
        //update the the user list
        const result = await insertChat(null,from,message);
        console.log("Result of inserting", result);
      }
    });
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.username}`);
    });
  });
  return io;
};

module.exports = socketService;
