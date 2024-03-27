/* Basic properties for express, body-parser, and controllers route */
require("dotenv").config();
const express = require('express')
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth/authRoutes');
const picRouter = require('./routes/projectMonitoring/picRoutes');

// Tarif Route  
const searchRoute = require('../src/routes/tarifRoutes/searchRoute');
const sheetRoute = require('../src/routes/tarifRoutes/sheetRoute');

/* Necessary variables */
const PORT = process.env.PORT || 3001;
const main = express();

main.use(bodyParser.json());
main.use(bodyParser.urlencoded ({
    extended: false
}));

main.use(authRouter);
main.use(picRouter);

// Tarif Use route
main.use('/search', searchRoute);
main.use('/sheet', sheetRoute);

main.listen(PORT, () => {
    console.log('Server is running! port: ' + PORT);
});