const mongoose = require("mongoose");
const schema = mongoose.Schema

const Userschema = new schema({
    user_id:{
        type: String,
        required: true,
        unique : true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    fa_secrete: {
        type: Object,
    },
    fa_auth: {
        type: Boolean,
    },
    created_at: {
        type: Date,
        required: true
    },
    login_type:{
        type: String
    },
    login_history:{
        type: Array
    }
},{ timestamp : true})

module.exports = mongoose.model('userAuth', Userschema)