/* Basic properties for express, body-parser, and controllers route */
require("dotenv").config();
const express = require('express')
const bodyParser = require('body-parser');

// Porto Route
const authRouter = require('./routes/authentication/auth.routes');
const stepOneRouter = require('./routes/productGuideEditor/step1.routes');

/* Necessary variables */
const PORT = process.env.PORT || 3001;
const main = express();

main.use(bodyParser.json());
main.use(bodyParser.urlencoded ({
    extended: false
}));

main.use(authRouter);
main.use(stepOneRouter);

main.listen(PORT, () => {
    console.log('Server is running! port: ' + PORT);
});