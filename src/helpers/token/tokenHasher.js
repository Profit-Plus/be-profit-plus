/* Utility class to encrypt tokens with particular encryption algorithm */
const cryptoAlgorithm = require('crypto');

function tokenHasher(token) {
    return cryptoAlgorithm.createHash('sha512').update(token).digest('hex');
} 

module.exports = { tokenHasher };