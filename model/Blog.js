const mongoose = require("mongoose")
const User = require("./User")

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    blogDisc: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps: true
})

module.exports = mongoose.model("Blog", blogSchema)