/**
 * @function toLowerCase is a middleware function to transform the request body into lowercase
 * @param {JSON} req 
 * @param {JSON} res 
 * @param {Object} next 
 */
function lowerCase(req, res, next) {
    try {
        /* Check if the request body is exist */
        const text = req.body;
        if (text) {
            /* transform each request body into lowercase using loop function */
            Object.keys(text).forEach(key => {
                /* Check if the type of request body is a string */
                if (typeof text[key] === 'string') {
                    text[key] = text[key].toLowerCase();
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
    
    next();
}

/**
 * @function toUpperCase is a middleware function to transform the request body into uppercase
 * @param {JSON} req 
 * @param {JSON} res 
 * @param {Object} next 
 */
function upperCase(req, res, next) {
    try {
        /* Check if the request body is exist */
        const text = req.body;
        if (text) {
            /* transform each request body into lowercase using loop function */
            Object.keys(text).forEach(key => {
                /* Check if the type of request body is a string */
                if (typeof text[key] === 'string') {
                    text[key] = text[key].toUpperCase();
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
    
    next();
}

module.exports = { 
    lowerCase,
    upperCase 
};