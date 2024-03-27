/* Utility class to encrypt tokens with particular encryption algorithm */
const cryptoAlgorithm = require('crypto');
function hashToken(token) {
    return cryptoAlgorithm.createHash('sha512').update(token).digest('hex');
} 

module.exports = { hashToken };