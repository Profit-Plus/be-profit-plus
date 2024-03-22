/* Utility class to generate tokens */
const jsonwebtoken = require('jsonwebtoken');

/* Generate access token and make it expired within 3 minutes */
/* This function is also generating the token based on user's role */
function generateAccessToken(user, role) {
    return jsonwebtoken.sign({
        userId : user.loginCredentialsId,
        userLevel: role.levelName,
    }, process.env.JWT_ACCESS_SECRET, {expiresIn: '3m'});
}

/* Generate refresh token and make it expired within 12 hours */
/* This function is also generating the token based on user's role */
/* If the token expired user have to re-log in to the system */
function generateRefreshToken(user, role, jti) {
    return jsonwebtoken.sign ({
        userId : user.id,
        userLevel: role.level,
    }, process.env.JWT_REFRESH_SECRET, {expiresIn: '12h'});
}

/* Generate all tokens in one function */
function generateTokens(user, role, jti) {
    const accessToken = generateAccessToken(user, role);
    const refreshToken = generateRefreshToken(user, role, jti);

    return {
        accessToken,
        refreshToken,
    };
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    generateTokens
};