const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        default: ""
    },
    otp: {
        type: Number,
        default: null  
    }
},{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)