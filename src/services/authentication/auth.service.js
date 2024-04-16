/* Service layer for token authentication */
const { database } = require('../../helpers/utils/db/database');
const { hashToken } = require('../../helpers/utils/authentication/hashtoken');

/* This method will called when whe create a new refresh token */
function addRefreshTokenToWhiteList( {jti, refreshToken, loginCredentialsId} ) {
    return database.refresh_token.create({
        data: {
            id: jti,
            hashed_token: hashToken(refreshToken),
            login_credentials: {
                connect: { login_credentials_id: loginCredentialsId}
            }
    });
}

/* This method called to check whether the token sent by existing client in database or not */
function findRefreshTokenById(id) {
    return database.refresh_token.findUnique({
        where: {
            id
        }
    })
}

/* Delete token after usage */
function deleteRefreshToken(id) {
    return database.refresh_token.update({
        where: {
            id
        },
        data: {
            revoked: true
        }
    });
}

function revokeTokens(userId) {
    return database.refresh_token.updateMany({
        where: {
            userId
        },
        data: {
            revoked: true
        }
    });
}

module.exports = {
    addRefreshTokenToWhiteList,
    findRefreshTokenById,
    deleteRefreshToken,
    revokeTokens
};