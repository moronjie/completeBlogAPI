const jwt = require('jsonwebtoken')
const User = require("../model/User")

const verifyToken = async (req, res, next)=>{
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
       
        const decode = jwt.verify(token, process.env.SECRET_KEY)
        if(!decode) return res.status(401).json({"msg": "you are not authorized"})
    
        const user = await User.findOne({_id : decode.id})
        !user && res.status(403).json({"msh": "please login"})
        req.user = user
        req.token = token
        next()
        
    } catch (error) {  
        next(error)
    }
}

module.exports = verifyToken