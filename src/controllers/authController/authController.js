const userService = require('../../services/authentication/user.service');
const authService = require('../../services/authentication/auth.service');
const { generateTokens } = require('../../helpers/utils/authentication/jsonwebtoken');
const webResponses = require('../../helpers/web/webResponses');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

/* registerController handles user registration operation */
/* Endpoint: '/profitplus/porto/registration/' */
async function registerController (req, res, next) {
    try {
        /* Request body */
        const { email, password, userName, unit, team, level } = req.body;
        /* Check if input is invalid */
        if (!email || !password || !unit || !team || !level) {
            res.status(400).json(webResponses.errorResponse('Invalid input! Fields cannot be empty'));
            throw new Error('There are several fields empty!');
        }

        /* Check if the email has been used before */
        const existingEmail = await userService.findLoginCredentialsByEmail(email);
        if (existingEmail) {
            res.status(400).json(webResponses.errorResponse('Email has been used!'));
            throw new Error('Multiple email is detected!');
        }

        /* If no error occurs, perform post operation to database and hold the id */
        const loginCredentials = await userService.createloginCredentialsByEmailAndPassword({ email, password, userName});
        const roles = userService.findRoleByLoginCredentialId(loginCredentials.loginCredentialsId);

        /* Store credentials as a new users */
        await userService.createNewUsers( {
            unitsName: unit,
            teamName: team,
            levelName: level,
            loginCredentialsId: loginCredentials.loginCredentialsId
        });

        /* Generate accessToken and refreshToken */
        const jti = uuidv4();
        const { accessToken, refreshToken } = generateTokens(loginCredentials, roles, jti);
        await authService.addRefreshTokenToWhiteList( {jti, refreshToken, loginCredentialsId: loginCredentials.loginCredentialsId});

        res.status(200).json(webResponses.successResponse('Generating tokens', {accessToken, refreshToken}));

    } catch (error) {
        console.log(error);
    }
}

/* loginController handles user login operation */
/* Endpoint: '/profitplus/porto/login/' */
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
        const userRole = await userService.findRoleByLoginCredentialId(existingUser.loginCredentialsId);
        const { accessToken, refreshToken } = generateTokens(existingUser, userRole, jti);
        await authService.addRefreshTokenToWhiteList({ jti, refreshToken, loginCredentialsId: existingUser.loginCredentialsId});

        /* Store access token and refresh token to local storage of the browser */
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        res.status(200).json(webResponses.successResponse('Generating tokens', {accessToken, refreshToken}));

    } catch (error) {
        console.log(error);
    }
}

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

module.exports = { 
    registerController,
    loginController,
    dashboardController,
    refreshTokensController
};