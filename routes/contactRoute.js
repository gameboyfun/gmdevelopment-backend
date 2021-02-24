const router = require('express').Router();
const verify = require('./verifyToken');
const Contact = require('../model/Contact');
const { contactvalidation } = require('../validation');
const { transporter, mailOptions } = require('../config');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});
const upload = multer({ storage: storage });


//Create
router.post('/', upload.array('img') , async (req, res) => {
    if(req.files.length >= 1) {
        var imgArray = []
        var path = []
        for(var i=0;i < req.files.length; i++) {
            imgArray.push(req.files[i].path)
            path.push({
                path: __dirname + `/../${req.files[i].path}`
            })
        }

    }

    //Validate data before submit message
    const { error } = contactvalidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Create contact
    const contact = new Contact({
        name: req.body.name,
        email: req.body.email,
        telephone: req.body.telephone,
        message: req.body.message,
        img: imgArray ? imgArray : null
    });
    try {
        const savedContact = await contact.save();
        const mailconfig = mailOptions(req.body,path ? path : null);
        transporter.sendMail(mailconfig, function (err, info) {
            if (err)
                console.log(err);
            else
                console.log(info);
        });
        res.status(201).send('Your contact have been save we will call back soon!!');
    } catch (err) {
        res.status(400).send(err);
    }
});

//Get all
router.get('/', verify, async (req, res) => {

    try {
        const allContact = await Contact.find();
        res.status(200).send(allContact)
    } catch (err) {
        res.status(400).send(err);
    }

});

//Get one
router.get('/:id', verify, async (req, res) => {

    try {
        const oneContact = await Contact.findById(req.params.id);
        res.status(200).send(oneContact);
    } catch (err) {
        res.status(400).send(err);
    }
});

//Delete
router.delete('/:id', verify, async (req, res) => {
    try {
        const deleteContact = await Contact.findByIdAndDelete(req.params.id)
        res.status(200).send('Delete success');
    } catch (err) {
        res.status(400).send(err)
    }
});

module.exports = router;