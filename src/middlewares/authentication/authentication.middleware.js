const jsonWebToken = require('jsonwebtoken');

/**
 * @function authenticator is a middleware function to authenticate user based on their token and their role
 * @param {JSON} req 
 * @param {JSON} res 
 * @param {Object} next 
 * @returns 
 */
function authenticator(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];
    /* Send unauthorized response if the token invalid */
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized User'});
    }

    try {
        jsonWebToken.verify(token, process.env.JWT_ACCESS_SECRET, (errors, decoded) => {
            console.log(decoded.level);
            req.level = decoded.level;

            next();
        });

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    authenticator 
};
