function formatErrorMessage(error) {
    let prop = error.instancePath;
    if (prop) prop = '\'' + error.instancePath.replace('/', '') + '\' ';
    const errMessage = prop + error.message;

    return errMessage;
}

module.exports = { formatErrorMessage };