const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../model/User')
const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.OPT_EMAIL,
        password: process.env.OPT_PASSWORD 
    }
})

router.post('/register', async (req, res, next) => {
    
    try {
        const existingUser = await User.findOne({email: req.body.email});
        existingUser && res.status(409).send("user already exist");

        const salt = await bcrypt.genSalt(10)
        const hashpassword = await bcrypt.hash(req.body.password, salt)

        const user = new User({...req.body, password: hashpassword});

        const newUser = await user.save()
        res.status(200).json(newUser);
    } catch (error) {
        res.status(500).json({"msg": error.message})
    }
})

router.post('/login', async(req, res, next) =>{
    try {
        const existingUser = await User.findOne({email: req.body.email});
        !existingUser && res.status(409).send("user does not exist");

        const comparePassword = await bcrypt.compare(req.body.password, existingUser.password)
        !comparePassword && res.status(403).json({msg: "wrong password"})

        const accessToken = jwt.sign({id: existingUser._id}, process.env.SECRET_KEY, {expiresIn: "1hr"})

        const {password, ...others} = existingUser._doc

        res.status(200).json({others, accessToken: accessToken})

    } catch (error) {
        res.status(500).json({"msg": error.message})
    }
})

router.post("send", async (req, re) => {
    const {email} = req.body
    const otp = Math.floor(100000 * math.random + 900000)
    try{
        const mailOption = {
            From: process.env.OPT_EMAIL,
            To: email,
            subject: "OPT Verification",
            text: `Your OPT verification is ${otp}`
        }

    }catch(err){
        res.status(500).json({'msg': err.message})
    }
})

module.exports = router