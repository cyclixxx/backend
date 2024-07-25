const mongoose = require("mongoose");
const schema = mongoose.Schema

const Userschema = new schema({
    user_id: {
        type: String, 
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    user: {
        type: Number,
        required: true,
    },
    wager: {
        type: Number,
        required: true,
    },
    claimed: {
        type: Number,
        required: true,
    },
    available: {
        type: Number,
        required: true,
    },
}, { timestamp : true})

module.exports = mongoose.model('affiliate', Userschema)