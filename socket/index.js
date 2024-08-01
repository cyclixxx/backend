const { Server } = require("socket.io");
const Chats = require("../model/public-chat");
const DiceGame = require("../model/dice_game");  
const { CrashGameEngine } = require("../controllers/crashControllers");

async function createsocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: ["https://magenta-stroopwafel-133857.netlify.app/","http://localhost:5173","http://localhost:5174" ]
    },
  });

  // Crash Game
  new CrashGameEngine(io)
    .run((latestBet) => {
      io.emit("latest-bet", latestBet);
    })
    .catch((err) => {
      console.log("Crash Game failed to start ::> ", err);
    });

  let newMessage = await Chats.find();
  const handleNewChatMessages = async (data) => {
    if(data.type === "normal"){
      if(newMessage.length > 100){
        newMessage.shift()
        newMessage.push(data)
      }
      else{
        newMessage.push(data)
      }
      io.emit("new-message", newMessage);
      await Chats.create(data);
    }
  };

  let fghhs = await DiceGame.find().limit(20)
  let activeplayers = [...fghhs];
  const DiceActivePlayers = async (e) => {
    if (activeplayers.length > 21) {
      activeplayers.shift();
      activeplayers.push(e);
    } else {
      activeplayers.push(e);
    }
    io.emit("dice-gamePLayers", activeplayers);
  };

  io.on("connection", (socket) => {
    socket.on("dice-game", (data) => {
      DiceActivePlayers(data);
    });
    socket.on("public-chat", (data) => {
      handleNewChatMessages(data);
    });
  });
}

module.exports = { createsocket }
