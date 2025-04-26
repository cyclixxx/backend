const Chats = require("../model/public-chat");

class ChatsController {
    constructor(io) {
        this.io = io;
        this.newMessage = [];

        this.io.on("connection", (socket) => {
            socket.on("public-chat", (data) => {
                this.handleNewChatMessages(data);
            });

            socket.on("disconnect", () => {
                console.log("User disconnected");
            });
            socket.on("error", (error) => {
                console.error("Socket error:", error);
            });

        }); 
    }

    getChats(){
        return this.newMessage;
    } 
    async handleNewChatMessages(data) {
        if(data.type === "normal"){
          if(this.newMessage.length > 100){
            this.newMessage.shift()
            this.newMessage.push(data)
          }
          else{
            this.newMessage.push(data)
          }
          this.io.emit("new-message", this.newMessage);
          await Chats.create(data);
        }
    };
    async getAllChats() {
        try {
            const chats = await Chats.find().limit(100).sort({ createdAt: -1 });
            return chats;
        } catch (error) {
            console.error("Error fetching chats:", error);
            throw error;
        }
    }
    async saveChat(data) {
        try {
            const chat = await Chats.create(data);
            return chat;
        } catch (error) {
            console.error("Error saving chat:", error);
            throw error;
        }
    }
    async deleteChat(chatId) {
        try {
            const chat = await Chats.findByIdAndDelete(chatId);
            return chat;
        } catch (error) {
            console.error("Error deleting chat:", error);
            throw error;
        }
    }
    async updateChat(chatId, data) {
        try {
            const chat = await Chats.findByIdAndUpdate(chatId, data, { new: true });
            return chat;
        }
            catch (error) {
            console.error("Error updating chat:", error);
            throw error;
        }
    }
    getChatsfromDB = async () => {
        try {
            const chats = await Chats.find().limit(100).sort({ createdAt: -1 });
            this.newMessage =  chats;
        } catch (error) {
            console.error("Error fetching chats:", error);
            throw error;
        }
    };
}


module.exports = ChatsController;