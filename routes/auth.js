const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const { registervalidation, loginvalidation } = require('../validation');

router.post('/register', async (req, res) => {

    //Validate data before create user
    const { error } = registervalidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Checking already user in DB
    const emailExist = await User.findOne({email: req.body.email});
    if ( emailExist ) return res.status(400).send('Email already Exists!');

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create User
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        res.status(201).send({user: user._id});
    } catch (err) {
        res.status(400).send(err);
    }
});

//Login
router.post('/login', async (req, res) => {

    //Validate data before login
    const { error } = loginvalidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Checking if email exist
    const user = await User.findOne({email: req.body.email});
    if ( !user ) return res.status(400).send('Email is not found');

    //Password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if ( !validPass ) return res.status(400).send('Invalid password');

    //Create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token);

    res.send(token);
});

module.exports = router;