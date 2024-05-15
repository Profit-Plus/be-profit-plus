/* Service layer for token authentication */
const { database } = require('../../helpers/configuration/db');
const { tokenHasher } = require('../../helpers/token/tokenHasher');

/* This method will called when whe create a new refresh token */
function addRefreshTokenToWhiteList( {jti, refreshToken, accessCredentialsId} ) {
    return database.refresh_token.create({
        data: {
            id: jti,
            hashed_token: tokenHasher(refreshToken),
            access_credentials: {
                connect: { access_credentials_id: accessCredentialsId}
            }
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
    return database.refresh_token.delete({
        where: {
            id: id
        }
    })
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