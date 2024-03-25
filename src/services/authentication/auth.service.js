/* Service layer for token authentication */
const { database } = require('../../helpers/utils/db/database');
const { hashToken } = require('../../helpers/utils/authentication/hashtoken');

/* This method will called when whe create a new refresh token */
function addRefreshTokenToWhiteList( {jti, refreshToken, loginCredentialsId} ) {
    return database.refreshToken.create({
        data: {
            id: jti,
            hashedToken: hashToken(refreshToken),
            loginCredentials: {
                connect: { 
                    loginCredentialsId
                }
            }
        }
    });
}

/* This method called to check whether the token sent by existing client in database or not */
function findRefreshTokenById(id) {
    return database.refreshToken.findUnique({
        where: {
            id
        }
    })
}

/* Delete token after usage */
function deleteRefreshToken(id) {
    return database.refreshToken.update({
        where: {
            id
        },
        data: {
            revoked: true
        }
    });
}

function revokeTokens(userId) {
    return database.refreshToken.updateMany({
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