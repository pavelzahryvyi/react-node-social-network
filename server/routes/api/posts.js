const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {body, validationResult} = require('express-validator');

const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');

// @route  POST api/posts
// @desc   Create a post
// @access Private
router.post('/', [auth, [
    body('text', 'Text is required').not().isEmpty()
]], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({msg: errors.array()})
    }

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        })

        await newPost.save();

        res.json(newPost);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route  GET api/posts
// @desc   Get all posts
// @access Public
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({date: -1});
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

// @route  GET api/posts/:id
// @desc   Get post by post ID
// @access Public
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //is post with id
        if (!post) {
            return res.status(400).json({msg: 'The post isn\'t found'});
        }
        res.json(post);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({msg: 'The post isn\'t found'});
        }
        res.status(500).send('Server error');
    }
})

// @route  DELETE api/posts/:id
// @desc   Delete post by ID
// @access Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //check a user
        //req.user.id from auth middleware
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({msg: "User is not authorised"});
        }

        //does post exists
        if (!post) {
            return res.status(400).json({msg: 'The post isn\'t found'});
        }

        await post.remove();

        res.json({msg: "Post is removed"});
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({msg: 'The post isn\'t found'});
        }
        res.status(500).send('Server error');
    }
})

// @route  GET
// @desc get posts of one user
// @access Public
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find({user: req.user.id});

        //check a user
        //req.user.id from auth middleware
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({msg: "User is not authorised"});
        }

        res.json(posts)
    } catch (err) {
        console.log(err);
        if (err.kind === 'ObjectId') {
            return res.status(400).json({msg: 'The post isn\'t found'});
        }
        res.status(500).send('Server error');
    }
})

// @route  PUT
// @desc like a post
// @access Priate
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)


        //Check if the post has already been liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            return res.status(400).json({msg: 'The post is already liked'});
        }

        post.likes.unshift({user: req.user.id});

        await post.save();

        res.json(post.likes)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

// @route  PUT
// @desc unlike a post
// @access Priate
router.put('/unLike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)


        //Check if the post has already been liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
            return res.status(400).json({msg: 'The post has not yet liked'});
        }

        //get index of user who liked the post
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeIndex, 1)

        await post.save();

        res.json(post.likes)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

module.exports = router;