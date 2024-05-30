function generateRandomString(maxDigits = 6) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';

    for (let i = 0; i < maxDigits; i++) {
        result += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return result;
}

module.exports = generateRandomString;