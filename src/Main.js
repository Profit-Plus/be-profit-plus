/* Basic properties for express, body-parser, and controllers route */
require("dotenv").config();
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const cors = require('cors');

// GTOM Route
const picRouter = require('./routes/projectMonitoring/picRoute');
const customerRouter = require('./routes/projectMonitoring/customerRoute');
const documentRouter = require('./routes/projectMonitoring/documentRoute');
const projectRouter = require('./routes/projectMonitoring/projectRoute');
const commentRouter = require('./routes/projectMonitoring/commentRoute');
const notificationRouter = require('./routes/projectMonitoring/notificationRoute');
const dashboardRouter = require('./routes/projectMonitoring/dashboardRoute');

// Tarif Route  
const searchRoute = require('./routes/tariffRoutes/searchRoute');
const sheetRoute = require('./routes/tariffRoutes/sheetRoute');
const masterPackageRoute = require('./routes/tariffRoutes/masterPackageRoute');
const offeringRoute = require('./routes/tariffRoutes/offeringRoute');
const productRoute = require('./routes/tariffRoutes/productRoute');
const dashboard = require('./routes/tariffRoutes/dashboardSSORoute');
const solution = require('./routes/tariffRoutes/solutionTariffRoute');


// Porto Route
const authRouter = require('./routes/authentication/auth.routes');
const stepOneRouter = require('./routes/productGuide/stepOne.routes');
const stepTwoRouter = require('./routes/productGuide/stepOne.routes');
const stepThreeRouter = require('./routes/productGuide/stepTwo.routes');

/* Necessary variables */
const PORT = process.env.PORT || 3001;
const main = express();

/* Use express */
main.use(cors());

main.use(cors());
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({
    extended: false
}));

// GTOM Use route
main.use(picRouter);
main.use(customerRouter);
main.use(documentRouter);
main.use(projectRouter);
main.use(commentRouter);
main.use(notificationRouter);
main.use(dashboardRouter);

// Tarif Use route
main.use('/tariff/search', searchRoute);
main.use('/tariff/sheet', sheetRoute);
main.use('/tariff/masterPackage', masterPackageRoute);
main.use('/tariff/offering', offeringRoute);
main.use('/tariff/product', productRoute);
main.use('/tariff/dashboard', dashboard);
main.use('/tariff/solution', solution);

// Porto Use route
main.use(authRouter);
main.use(stepOneRouter);
main.use(stepThreeRouter);
main.use(stepTwoRouter);

main.listen(PORT, () => {
    console.log('Server is running! port: ' + PORT);
});