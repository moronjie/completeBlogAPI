const router = require('express').Router()
const User = require("../model/User")
const verifyToken = require("../middleware/jwt")

// get all users
router.get("/", verifyToken, async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
        
    } catch (error) {
        res.status(500).json({"msg": error.message})
    }
})

// get a user 
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const users = await User.findById(req.params.id)
        res.json(users)
        
    } catch (error) {
        res.status(500).json({"msg": error.message})
    }
})


// update a user
router.put(":/", verifyToken, async (req, res) => {
    try {
        if(req.params.id !== req.user._id){
            return res.status(401).json({"msg": "You are not authorized to update this user"})
        }

        const newUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
    } catch (error) {
        res.status(500).json({"msg": error.message})
    }
})

// delete a user
router.put(":/", verifyToken, async (req, res) => {
    try {
        if(req.params.id !== req.user._id){
            return res.status(401).json({"msg": "You are not authorized to delete this user"})
        }

        const newUser = await User.findOneAndDelete({
            _id: req.params.id
        })
    } catch (error) {
        res.status(500).json({"msg": error.message})
    }
})

module.exports = router