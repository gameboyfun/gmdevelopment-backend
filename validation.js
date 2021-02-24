//VALIDATION
const Joi = require('@hapi/joi');

//Register Validation
const registervalidation = data => {
    const schema = Joi.object(
        {
            name: Joi.string().min(6).required(),
            email: Joi.string().min(6).required().email(),
            password: Joi.string().min(6).required()
        }
    );
    return schema.validate(data);
}

module.exports.registervalidation = registervalidation;

//Login Validation
const loginvalidation = data => {
    const schema = Joi.object(
        {
            email: Joi.string().min(6).required().email(),
            password: Joi.string().min(6).required()
        }
    );
    return schema.validate(data);
}

module.exports.loginvalidation = loginvalidation;

// contact Validation
const contactvalidation = data => {
    const schema = Joi.object(
        {
            name: Joi.string().min(1).required(),
            email: Joi.string().min(6).required().email(),
            telephone: Joi.string().min(9).max(10).required(),
            message: Joi.string().required()
        }
    );
    return schema.validate(data)
}

module.exports.contactvalidation = contactvalidation;