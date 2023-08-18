const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../model/User')
const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'njiemoro2@gmail.com',
        pass: process.env.OPT_PASSWORD
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

router.post("/sendotp", async (req, res) => {
    const {email} = req.body   
    const otp = Math.floor(100000 * Math.random() + 900000)
    try{
        const mailOption = {
            from: "njiemoro2@gmail.com",
            to: email,
            subject: "OPT Verification",
            text: `Your OPT verification is ${otp}`
        }

        transporter.sendMail(mailOption, (err, info) => {
            if(err){
                return res.status(500).json({"msg": err.message})
            }

            res.status(200).json({"msg": "an OPT sent to your email"})
        })

        const user = await User.findOne({email})
        user.otp = otp

        await user.save()

    }catch(err){
        res.status(500).json({'msg': err.message})
    }
})

router.post("/resetPassword", async (req, res) => {
    try {
        const {email, newpassword, otp} = req.body
        const user = await User.findOne({email: email})

        !user && res.status(403).json({"msg": "user does not exist. Create an account"})

        if(user.otp != otp){
            res.status(404).json({"msg": "wrong OPT"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashpassword = await bcrypt.hash(newpassword, salt)
 
        user.password = hashpassword
        user.otp = null 
        await user.save()  

        res.status(200).json({"msg": "password is reset successfilly"})
    } catch (error) {
        
    }

})

module.exports = router