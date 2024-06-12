function formatErrorMessage(error) {
    let prop = error.instancePath;
    if (prop) prop = '\'' + error.instancePath.replace('/', '') + '\' ';
    const errMessage = 'Invalid input! ' + prop + error.message;

    return errMessage;
}

module.exports = { formatErrorMessage };