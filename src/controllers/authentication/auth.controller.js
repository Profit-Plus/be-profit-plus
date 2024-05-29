const authValidator = require('../../validators/authentication/auth.validator');
const userService = require('../../services/authentication/user.service');
const authService = require('../../services/authentication/auth.service');
const response = require('../../helpers/web/webResponses');
const jsonWebToken = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { generateTokens, generateAccessToken } = require('../../helpers/token/jwtGenerator');
const { v4: uuidv4 } = require('uuid');

/**
 * @function userRegistration to handle the registration process of the user
 */
async function userRegistration(req, res, next) {
    try {
        /* Initialize the request body of the API */
        const registrationCredentials = req.body.registrationCredentials;
        const userProperties = req.body.userProperties;

        /* Validate the request body of registrationCredentials */
        const { error, value } = authValidator.accessCredentialsValidation(registrationCredentials);
        if (error) {
            res.status(400).json(response.errorResponse({
                error: error.details[0].message
            }));
            next(new Error('Failed validation!'));
        }

        /* Check if the email has been used before */
        const existingEmail = await userService.findAccessCredentials(value.email);
        if (existingEmail) {
            res.status(409).json(response.errorResponse('Email has been used!'));
            next(new Error('Failed validation!'));
        }

        /* Create a new user credentials and add the details to user table */
        const newAccessCredentials = await userService.createUserAccessCredentials(value);
        await userService.createNewUsers(userProperties, newAccessCredentials);
        
        /* Generate access token and refresh token */
        const jwtId = uuidv4();
        const { accessToken, refreshToken } =
        generateTokens(value, userProperties, jwtId);
        await authService.addRefreshTokenToWhiteList({ jwtId, refreshToken, accessCredentialsId: newAccessCredentials.access_credentials_id});

        /* Send responses */
        res.status(200).json(response.successResponse('Registration success!', { accessToken, refreshToken }));

    } catch (error) {
        res.status(500).json(response.errorResponse('Internal Server error!'));
        next(error);
    }
}

/**
 * @function userLogin to handle the login process of the user and generete a pair of access token and refresh token
 */
async function userLogin(req, res, next) {
    try {
        /* Initialize request body of the API */
        const loginCredentials = req.body.loginCredentials;

        /* Validate the request body of loginCredentials */
        const { error, value } = authValidator.loginCredentialsValidation(loginCredentials);
        if (error) {
            res.status(400).json(response.errorResponse({ error: error.details[0].message }));
            next(new Error('Failed validation!'));
        }

        /* Check if the email belongs to existed user */
        const existedEmail = await userService.findAccessCredentials(value.email);
        if (!existedEmail) {
            res.status(401).json(response.errorResponse("Wrong credentials!"));
            next(new Error('Wrong credentials!'));
        }

        /* Compare the password that inputted with the password inside the database*/
        const validPassword = await bcrypt.compare(value.password, existedEmail.password);
        if (!validPassword) {
            res.status(400).json(response.errorResponse("Wrong credentials!"));
            next(new Error('Wrong credentials!'));
        }

        /* If no errors occured, generate access and refresh token */
        /* Generate access token and refresh token */
        
        const jwtId = uuidv4();
        const userProperties = await userService.findUserPropertiesByAccessCredentialId(existedEmail.access_credentials_id);
        const { accessToken, refreshToken } = generateTokens(existedEmail, userProperties, jwtId);
        await authService.addRefreshTokenToWhiteList({ 
            jwtId, 
            refreshToken, 
            accessCredentialsId: existedEmail.access_credentials_id
        });

        /* Send responses */
        res.status(200).json(response.successResponse('Log in success!', { 
            accessToken, 
            refreshToken 
        }));

    } catch (error) {
        res.status(500).json(response.errorResponse('Internal Server error!'));
        next(error);
    }
}

/**
 * @function generateNewToken to generate a new access token (Called when the access token has expired)
 */
async function generateNewToken(req, res, next) {
    try {
        /* Initialize request body and perform validation */
        const { refreshToken } = req.body;
        
        /* Verifying the properties of token */
        jsonWebToken.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (error, decoded) => {
            if (error) {
                if (error.name === 'TokenExpiredError') {
                    await authService.deleteRefreshToken(decoded.jti);
                    res.status(400).json(response.errorResponse('Token has expired!'));
                    next(new Error('Expired token!'));

                } else {
                    res.status(400).json(response.errorResponse('Token is invalid!'));
                    next(new Error('Invalid token!'));

                }

            } else {
                /* Check if the token belongs to a valid user  */
                const validUser = await userService.checkUserValidation(decoded.userId);
                if (!validUser) {
                    res.status(400).json(response.errorResponse('User has no longer authorized!'));
                    next(new Error('Unauthorized user!'));

                } else {
                    /* Properties of user and their access credentials from token */
                    const accessCredendials = {
                        access_credentials_id: decoded.userId
                    };

                    const userProperties = {
                        units_name: decoded.unit,
                        team_name: decoded.team,
                        level_name: decoded.level
                    };

                    /* New JWT Identifier using UUID */
                    const jwtId = uuidv4();

                    /* Generate a new access token */
                    const newAccessToken = generateAccessToken(accessCredendials, userProperties, jwtId);

                    res.status(200).json(response.successResponse('New access token generated!', newAccessToken));
                }
            }
        });
        
    } catch (error) {
        res.status(500).json(response.errorResponse('Internal Server error!'));
        next(error);
    }
}

module.exports = {
    userRegistration,
    userLogin,
    generateNewToken
}