const mongoose = require("mongoose");
const schema = mongoose.Schema

const Userschema = new schema({
    user_id: {
        type: String,
        required: true,
    },
    msg_id: {
        type: String,
        required: true,
    },
    profile: {
        type: Object,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    gif: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    }
}, { timestamp : true})

module.exports = mongoose.model('public_chat', Userschema)