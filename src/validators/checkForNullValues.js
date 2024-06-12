/**
 *  Function to validate request.
 *  This function will check whether there is a null value on the request body
 *  @returns true if there is a null value
 */
function checkForNullValues(req) {
    for (const key in req.body) {
        if (req.body[key] === null) {
            return true;
        }
        
        return false;
    }
}

module.exports = checkForNullValues;