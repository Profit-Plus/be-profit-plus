const { findLoginCredentialsByEmail, createloginCredentialsByEmailAndPassword, createNewUsers, findRoleByLoginCredentialId, } = require('../../services/authentication/user.service');
const { addRefreshTokenToWhiteList } = require('../../services/authentication/auth.service');
const { generateTokens } = require('../../helpers/utils/authentication/jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

/* registerController handles user registration operation */
/* Endpoint: '/profitplus/porto/registration/' */
const registerController = {
    /* newUserRegistration can only be used by superadmin */
    newUserRegistration: async (req, res, next) => {
        try {
            /* Request body */
            const { email, password, userName, unit, team, level } = req.body;
            /* Check if input is invalid */
            if (!email || !password || !unit || !team || !level) {
                res.status(400).json({ message: 'Invalid input! Fields cannot be empty'});
                throw new Error('There are several fields empty!');
            }

            /* Check if the email has been used before */
            const existingEmail = await findLoginCredentialsByEmail(email);
            if (existingEmail) {
                res.status(400).json({ message: 'Email has been used!'});
                throw new Error('Multiple email is detected!');
            }

            /* If no error occurs, perform post operation to database and hold the id */
            const loginCredentials = await createloginCredentialsByEmailAndPassword({ email, password, userName});
            const roles = findRoleByLoginCredentialId(loginCredentials.loginCredentialsId);

            /* Store credentials as a new users */
            await createNewUsers( {
                unitsName: unit,
                teamName: team,
                levelName: level,
                loginCredentialsId: loginCredentials.loginCredentialsId
            });

            /* Generate accessToken and refreshToken */
            const jti = uuidv4();
            const { accessToken, refreshToken } = generateTokens(loginCredentials, roles, jti);
            await addRefreshTokenToWhiteList( {jti, refreshToken, loginCredentialsId: loginCredentials.loginCredentialsId});

            res.status(404).json({
                accessToken,
                refreshToken
            });

        } catch (error) {
            console.log(error);
        }
    }
}

/* loginController handles user login operation */
/* Endpoint: '/profitplus/porto/login/' */
const loginController = {
    existingUserLogin: async (req, res, next) => {
        try {
            /* Request body */
            const {email, password} = req.body;
            /* Check if input is invalid */
            if (!email || !password) {
                res.status(400).json({message: "Invalid email or password!"});
                throw new Error('Invalid input detected!');
            }

            /* Check email belongs to existing user */
            const existingUser = await findLoginCredentialsByEmail(email);
            if (!existingUser) {
                res.status.json({ message: "Invalid login credentials!"});
                throw new Error('Wrong credentials (email) detected!');
            }

            /* Check if the password is valid */
            const validPassword = await bcrypt.compare(password, existingUser.password);
            if (!validPassword) {
                res.status.json({ message: "Invalid login credentials!"});
                throw new Error('Wrong credentials (password) detected!');
            }

            /* Generate tokens if there is no error occured */
            const jti = uuidv4();
            const userRole = await findRoleByLoginCredentialId(existingUser.loginCredentialsId);
            const { accessToken, refreshToken } = generateTokens(existingUser, userRole, jti);
            await addRefreshTokenToWhiteList({ jti, refreshToken, loginCredentialsId: existingUser.loginCredentialsId});
            const role = userRole.levelName;

            res.status(200).json({
                accessToken, refreshToken
            });

        } catch (error) {
            console.log(error);
        }
    }
}

const testController = {
    dashboardController: async (req, res, next) => {
        try {
            if (req.role !== 'SUPERADMIN') {
                res.status(200).json({
                    message: 'Forbidden user! admin role needed'
                });
            } else {
                res.status(200).json({
                    message: 'Successfully access the controller'
                });
            }
            
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = { 
    registerController,
    loginController,
    testController
};