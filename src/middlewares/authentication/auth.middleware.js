const response = require('../../helpers/web/webResponses');
const jsonWebToken = require('jsonwebtoken');

/**
 * @function authenticateUser is a middleware to authenticate user when they try to log in
 * @param {Object} req 
 * @param {JSON} res 
 * @param {Function} next 
 * @returns 
 */
function authenticateUser (req, res, next) {
    const token = req.headers.authorization.split(' ')[1];
    /* Send unauthorized response if the token invalid */
    if (!token) {
        return res.status(401).json(response.errorResponse('Unauthorized user!'));
    }

    try {
        jsonWebToken.verify(token, process.env.JWT_ACCESS_SECRET, (errors, decoded) => {
            if (errors) {
                if (errors.name === 'TokenExpiredError') {
                    res.status(400).json(response.errorResponse('Token has expired!'));
                    next(new Error('Expired token!'));

                } else {
                    res.status(400).json(response.errorResponse('Token is invalid!'));
                    next(new Error('Invalid token!'));
                }
            } else {
                req.userId = decoded.userId;
                req.unit = decoded.unit;
                req.level = decoded.level;
                req.team = decoded.team;

                next();
            }                
        });

    } catch (error) {
        console.log(error);
    }
}

module.exports = { authenticateUser };
