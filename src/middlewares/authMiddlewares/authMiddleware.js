/**
 * Middleware to authenticate user based on their token and their role
 */
const jsonWebToken = require('jsonwebtoken');

const authenticationMiddleware = {
    authenticateUser: (req, res, next) => {
        const token = req.headers.authorization.split(' ')[1];
        /* Send unauthorized response if the token invalid */
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized User'});
            throw new Error('Unauthorized');
        }

        try {
            jsonWebToken.verify(token, process.env.JWT_ACCESS_SECRET, (errors, decoded) => {
                console.log(decoded.userLevel);
                req.role = decoded.userLevel;

                next();
            });

        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = {authenticationMiddleware};
