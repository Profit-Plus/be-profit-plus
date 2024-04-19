const userService = require('../../services/authentication/user.service');
const authService = require('../../services/authentication/auth.service');
const { generateTokens } = require('../../helpers/utils/authentication/jsonwebtoken');
const webResponses = require('../../helpers/web/webResponses');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

/**
 * @function registerController to handles user registration operation
 * @endpoint http://localhost:3001/profitplus/register/
 * @param {JSON} req  
 * @param {Object} next
 * @return {JSON} res 
 */
async function registerController (req, res, next) {
    try {
        /* Request body */
        const requestBody = req.body;
        /* Check if input is invalid */
        if (!requestBody.email || !requestBody.password || !requestBody.unit || !requestBody.team || !requestBody.level || !requestBody.userName) {
            res.status(400).json(webResponses.errorResponse('Invalid input! Fields cannot be empty'));
            throw new Error('There are several fields empty!');
        }

        /* Check if the email has been used before */
        const existingEmail = await userService.findLoginCredentialsByEmail(requestBody.email);
        if (existingEmail) {
            res.status(400).json(webResponses.errorResponse('Email has been used!'));
            throw new Error('Multiple email is detected!');
        }

        /* If no error occurs, perform post operation to database and hold the id */
        const loginCredentials = await userService.createloginCredentialsByEmailAndPassword(requestBody);
        const roles = userService.findRoleByLoginCredentialId(loginCredentials.login_credentials_id);

        console.log(roles.levels);

        /* Store credentials as a new users */
        const createNewUser = await userService.createNewUsers(requestBody, loginCredentials);

        /* Generate accessToken and refreshToken */
        const jti = uuidv4();
        const { accessToken, refreshToken } = generateTokens(loginCredentials.login_credentials_id, roles, jti);
        await authService.addRefreshTokenToWhiteList( {jti, refreshToken, loginCredentialsId: loginCredentials.login_credentials_id});

        res.status(200).json(webResponses.successResponse('Generating tokens', {accessToken, refreshToken}));

    } catch (error) {
        console.log(error);
    }
}

/**
 * @function loginController to handles user login operation
 * @endpoint http://localhost:3001/profitplus/login
 * @param {JSON} req  
 * @param {Object} next
 * @return {JSON} res 
 */
async function loginController(req, res, next) {
    try {
        /* Request body */
        const {email, password} = req.body;
        /* Check if input is invalid */
        if (!email || !password) {
            res.status(400).json(webResponses.errorResponse('Invalid input! Fields cannot be empty'));
            throw new Error('Invalid input detected!');
        }

        /* Check email belongs to existing user */
        const existingUser = await userService.findLoginCredentialsByEmail(email);
        if (!existingUser) {
            res.status(400).json(webResponses.errorResponse('Invalid login credentials!'));
            throw new Error('Wrong credentials (email) detected!');
        }

        /* Check if the password is valid */
        const validPassword = await bcrypt.compare(password, existingUser.password);
        if (!validPassword) {
            res.status(400).json(webResponses.errorResponse('Invalid login credentials!'));
            throw new Error('Wrong credentials (password) detected!');
        }

        /* Generate tokens if there is no error occured */
        const jti = uuidv4();
        const userRole = await userService.findRoleByLoginCredentialId(existingUser.login_credentials_id);
        const { accessToken, refreshToken } = generateTokens(existingUser, userRole, jti);
        await authService.addRefreshTokenToWhiteList({ jti, refreshToken, loginCredentialsId: existingUser.login_credentials_id});

        res.status(200).json(webResponses.successResponse('Generating tokens', {accessToken, refreshToken}));

    } catch (error) {
        console.log(error);
    }
}

/**
 * @function dashboardController to test the authentication API
 * @endpoint http://localhost:3001/profitplus/porto/dashboard
 * @param {JSON} req  
 * @param {Object} next
 * @return {JSON} res 
 */
async function dashboardController(req, res, next) {
    try {
        if (req.role !== 'SUPERADMIN') {
            res.status(400).json(webResponses.errorResponse('Access Denied!'));
        } else {
            const authorization = true;
            res.status(400).json(webResponses.successResponse('Access Granted!', 'Authorization: ' + authorization));
        }
    } catch (error) {
        console.log(error);
    }
}

/**
 * @function dashboardController to refresh a new token whenever the access token is expired
 * @endpoint http://localhost:3001/profitplus/porto/dashboard
 * @param {JSON} req  
 * @param {Object} next
 * @return {JSON} res 
 */
async function refreshTokensController(req, res, next) {
    try {
        /* Check if refreshToken is valid and exist in our database */
        const { refreshToken } = req.body['refreshToken'];
        if (!refreshToken) {
            res.status(401).json(webResponses.errorResponse('Missing refresh token!'));
            throw new Error('Refresh token is missing!');
        }

        /* Verify token whether it's still valid and exist in our database or not */
        /* If all the conditions meet, API will invalidate the previous token and generate new pair of tokens */
        const payload = jsonWebToken.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const savedRefreshToken = await authService.findRefreshTokenById(payload.jti);

        if (!savedRefreshToken || savedRefreshToken.revoked == true) {
            res.status(401).json(webResponses.errorResponse('Unauthorized!'));
            throw new Error('Unauthorized!');
        }
        
        /* Check if the user is still authorized */
        const user = await findUserById(payload.userId);
        if (!user) {
            res.status(401).json(webResponses.errorResponse('Unauthorized!'));
            throw new Error('Unauthorized!');
        }

        /* Delete the previous token and generate the new one */
        await authService.deleteRefreshToken(savedRefreshToken.id);
        const jti = uuidv4();
        const { accessToken, refreshToken: newRefreshToken} = generateTokens(user, jti);
        await authService.addRefreshTokenToWhiteList({ jti, refreshToken: newRefreshToken, userId: user.id});

        res.status(200).json(webResponses.successResponse('Generating new tokens', {accessToken, refreshToken: newRefreshToken}));

    } catch (error) {
        console.log(error);
    }
}

/**
 *  Exporting all functions
 */
module.exports = { 
    registerController,
    loginController,
    dashboardController,
    refreshTokensController
};