const mongoose = require('mongoose')

const connectDB = (url) => {
    mongoose.connect(url, {
        dbName: 'Blog-API'
    })
}

module.exports = connectDB

