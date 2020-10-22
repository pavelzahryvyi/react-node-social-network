const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {body, validationResult} = require('express-validator')

const User = require('../../models/User')
const Profile = require('../../models/Profile')

// @route  GET api/profile/me - my profile
// @desc   Get current user profile
// @access Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({msg: 'The profile is not found'});
        }
        res.json(profile)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server Error')
    }
});

// @route  POST api/profile - my profile
// @desc   create or update a user profile
// @access Private
router.post('/', auth, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    // get data from a client
    const {
        city,
        country,
        status,
        skills,
        facebook,
        instagram,
        twitter,
        github,
        wrapperPhoto,
    } = req.body

    //Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (status) profileFields.status = status;
    if (wrapperPhoto) profileFields.wrapperPhoto = wrapperPhoto;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    //location object
    profileFields.location = {};
    if (city) profileFields.location.city = city;
    if (country) profileFields.location.country = country;

    //build social object
    profileFields.contacts = {};
    if (facebook) profileFields.contacts.facebook = facebook;
    if (instagram) profileFields.contacts.instagram = instagram;
    if (twitter) profileFields.contacts.twitter = twitter;
    if (github) profileFields.contacts.github = github;

    try {
        let profile = await Profile.findOne({user: req.user.id});

        //update
        if (profile) {
            profile = await Profile.findOneAndUpdate(
                {user: req.user.id},
                {$set: profileFields},
                {new: true});

            return res.json(profile);
        }

        /*create*/
        profile = new Profile(profileFields);

        //saving data
        await profile.save();

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error')
    }

})

// @route  GET api/profile - my profile
// @desc   get all profiles
// @access public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']).sort({date: -1});
        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error")
    }
})


// @route  GET api/profile/user/:userId - my profile
// @desc   get profile by userId
// @access public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile
            .findOne({user: req.params.user_id})
            .populate('user', ['name', 'avatar']);

        if(!profile){
            return res.status(400).json({ msg: 'No profile for the user' });
        }
        res.json(profile);
    } catch (error) {
        if(error.kind === "ObjectId"){
            return res.status(400).json({ msg: 'Profile is not found' });
        }
        console.error(error.message);
        res.status(500).send("Server error")
    }
})

// @route  DELETE api/profile
// @desc   Delete profile, user & posts
// @access private
router.delete('/', auth, async (req, res) => {
    try {
        //@todo - remove users posts


        //Remove user profile
        await Profile.findOneAndRemove({user: req.user.id});

        //Remove the user
        await User.findOneAndRemove({_id: req.user.id});

        res.json({ msg: "User deleted" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error")
    }
})

module.exports = router;