const jsonwebtoken = require('jsonwebtoken');

/**
 * @function generateAccessToken Generate access token and make it expired within 3 minutes
 * This function is also generating the token based on user's role, team, and level
 * @param {Object} userCredentials 
 * @param {Object} userProperties 
 * @returns token generated
 */
function generateAccessToken(userCredentials, userProperties) {
    return jsonwebtoken.sign({
        userId: userCredentials.access_credentials_id,
        unit: userProperties.units_name,
        team: userProperties.team_name,
        level: userProperties.level_name
    }, 
    process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRED });
}

/**
 * @function generateRefreshToken Generate refresh token and make it expired within 12 hours
 * This function is also generating the token based on user's role, team, and level
 * If the token expired user have to re-log in to the system
 * @param {Object} userCredentials 
 * @param {Object} userProperties 
 * @param {String} jti 
 * @returns token generated
 */
function generateRefreshToken(userCredentials, userProperties, jti) {
    return jsonwebtoken.sign ({
        userId: userCredentials.access_credentials_id,
        unit: userProperties.units_name,
        team: userProperties.team_name,
        level: userProperties.level_name,
        jti: jti
    }, process.env.JWT_REFRESH_SECRET, {expiresIn: process.env.JWT_REFRESH_EXPIRED });
}

/**
 * @function generateRefreshToken Generate all tokens in one function
 * @param {Object} userCredentials 
 * @param {Object} userProperties 
 * @param {String} jti 
 * @returns {accessToken, refreshToken}
 */
function generateTokens(userCredentials, userProperties, jti) {
    const accessToken = generateAccessToken(userCredentials, userProperties);
    const refreshToken = generateRefreshToken(userCredentials, userProperties, jti);

    return {
        accessToken,
        refreshToken,
    };
}

module.exports = {
    generateAccessToken,
    generateTokens
};