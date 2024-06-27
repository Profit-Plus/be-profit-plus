const joi = require('joi');

/**
 * @function accessCredentialsValidation to validate access credentials when new user registered
 * @param {Object} regCredentials 
 * @returns validation schema
 */
function accessCredentialsValidation(regCredentials) {
    const schema = joi.object({
        email: joi.string().email().required().messages({'any.only': 'Invalid email!'}),
        userName: joi.string().min(3).max(30).required(),
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required(),
        repeatPassword: joi.any().valid(joi.ref('password')).required()
    });

    return schema.validate(regCredentials);
}

/**
 * @function loginCredentialsValidation to validate access credentials when a user try to log in
 * @param {Object} loginCredentials 
 * @returns validation schema
 */
function loginCredentialsValidation(loginCredentials) {
    const schema = joi.object({
        email: joi.string().email().required().messages({'any.only': 'Invalid email!'}),
        password: joi.string().required()
    });

    return schema.validate(loginCredentials);
}

/**
 * @function tokenValidation to validate whether the token empty or not
 * @param {Object} token 
 * @returns validation schema
 */
function tokenValidation(token) {
    const schema = joi.object({
        refreshToken: joi.string().required()
    });

    return schema.validate(token);
}

module.exports = {
    accessCredentialsValidation,
    loginCredentialsValidation,
    tokenValidation
}