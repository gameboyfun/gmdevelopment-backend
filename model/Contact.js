const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 1
    },
    email: {
        type: String,
        required: true,
        min: 6
    },
    telephone: {
        type: String,
        required: true,
        min: 9,
        max: 10
    },
    message: {
        type: String,
        required:true
    },
    img: {
        type: Array,
        // required:true
    },
    createDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Contact', contactSchema);