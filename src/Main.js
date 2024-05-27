/* Basic properties for express, body-parser, and controllers route */
require("dotenv").config();
const express = require('express')
const bodyParser = require('body-parser');

// GTOM Route
const picRouter = require('./routes/projectMonitoring/picRoute');
const customerRouter = require('./routes/projectMonitoring/customerRoute');
const documentRouter = require('./routes/projectMonitoring/documentRoute');
const projectRouter = require('./routes/projectMonitoring/projectRoute');

// Tarif Route  
const searchRoute = require('./routes/tariffRoutes/searchRoute');
const sheetRoute = require('./routes/tariffRoutes/searchRoute');
const masterPackageRoute = require('./routes/tariffRoutes/masterPackageRoute');

// Porto Route
const authRouter = require('./routes/auth/auth.routes');
const stepOneRouter = require('./routes/productGuide/stepOne.routes');
const stepTwoRouter = require('./routes/productGuide/stepOne.routes');
const stepThreeRouter = require('./routes/productGuide/stepTwo.routes');

/* Necessary variables */
const PORT = process.env.PORT || 3001;
const main = express();

main.use(bodyParser.json());
main.use(bodyParser.urlencoded({
    extended: false
}));

// GTOM Use route
main.use(picRouter);
main.use(customerRouter);
main.use(documentRouter);
main.use(projectRouter);

// Tarif Use route
main.use('/tariff/search', searchRoute);
main.use('/tariff/sheet', sheetRoute);
main.use('/tariff/masterPackage', masterPackageRoute);

// Porto Use route
main.use(authRouter);
main.use(stepOneRouter);
main.use(stepThreeRouter);
main.use(stepTwoRouter);

main.listen(PORT, () => {
    console.log('Server is running! port: ' + PORT);
});