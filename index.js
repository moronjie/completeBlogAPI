require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const morgan = require("morgan")
const mongoose = require("mongoose")
const app = express()
const connect = require("./model/connect")
const auth = require("./routes/auth")

const port = process.env.PORT || 4000

//middlewares    
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(morgan("common"))


//router
app.use('/auth', auth)  

connect(process.env.db)

mongoose.connection.on("error", () => {
    console.log("database cannot connect, check your internet connections");
})

mongoose.connection.once("open", () => {
    app.listen(port, () => {console.log(`app is listening at port ${port}`);})
})
