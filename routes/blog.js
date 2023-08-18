const router = require('express').Router()
const verifyToken = require('../middleware/jwt')
const Blog = require("../model/Blog")

//post blog
router.post("/", verifyToken, async (req, res) =>{
    try {
        const blog = new Blog(req.body)
    
        blog.owner = req.user._id
    
        await blog.save()
        res.status(200).json({'msg': 'blog uploaded successefully'})
        
    } catch (error) {
        res.status(500).json({"msg": error.message})
    }
})

//get all blogs
router.get("/", verifyToken, async (req, res) => {
    try {
        const blogs = await Blog.find()
        res.status(200).json(blogs)
        
    } catch (error) {
        res.status(500).json({"msg": error.message})
    }
})

//get specific blog
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
        res.json(blog)
        
    } catch (error) {
        res.status(500).json({"msg": error.message})
    }
})

//update a blog 
router.patch("/update/:id", verifyToken, async (req, res) => {
    try {
        const blog = await Blog.findOneAndUpdate({_id: req.params.id, owner : req.user._id}, req.body, {new: true})
        !blog && res.status(403).json({"msg": "you can only update your blog"})

        res.status(200).json({"msg": "blog updated successfully"})
    } catch (error) {
        res.status(500).json({"msg": error.message})
    }
})

//delete a blog
router.delete("/delete/:id", verifyToken, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
        if(blog.owner != req.user._id){
            res.status(403).json({"msg": "you can only delete your own post"})
        }
        
        await Blog.findOneAndDelete({_id: req.params.id})
    } catch (error) {
        res.status(500).json({"msg": error.message})
    }
})

module.exports = router