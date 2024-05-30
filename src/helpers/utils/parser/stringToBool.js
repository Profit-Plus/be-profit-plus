function parseStringToBoolean(string) {
    return string === "true" ? true : string === "false" ? false : undefined;
};

module.exports = parseStringToBoolean;