/* Basic properties for express, body-parser, and controllers route */
require("dotenv").config();
const express = require('express')
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth/authRoutes');
const picRouter = require('./routes/projectMonitoring/picRoutes');

/* Necessary variables */
const PORT = process.env.PORT || 3001;
const main = express();

main.use(bodyParser.json());
main.use(bodyParser.urlencoded ({
    extended: false
}));

main.use(authRouter);
main.use(picRouter);

main.listen(PORT, () => {
    console.log('Server is running! port: ' + PORT);
});