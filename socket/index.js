const { Server } = require("socket.io");
const DiceGame = require("../model/dice_game");  
const PubicChats = require("../controllers/Chat");
const { CrashGameEngine } = require("../controllers/crashControllers");

async function createsocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: ["https://stroopwafe.netlify.app","http://localhost:5173","http://localhost:5174" ]
    },
  });

  // Crash Gamem
  new CrashGameEngine(io)
    .run((latestBet) => {
      io.emit("latest-bet", latestBet);
    })
    .catch((err) => {
      console.log("Crash Game failed to start ::> ", err);
    });

    new PubicChats(io)
    .getChatsfromDB((newMessage) => {
      io.emit("new-message", newMessage);
    })
    .catch((err) => {
      console.log("Chat failed to start ::> ", err);
    });



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
  });
}

module.exports = { createsocket }
