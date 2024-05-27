/* Basic properties for express, body-parser, and controllers route */
require("dotenv").config();
const express = require('express')
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth/authRoutes');
const picRouter = require('./routes/projectMonitoring/picRoutes');
const cors = require('cors');

// Tarif Route  
const searchRoute = require('./routes/tariffRoutes/searchRoute');
const sheetRoute = require('./routes/tariffRoutes/searchRoute');
const masterPackageRoute = require('./routes/tariffRoutes/masterPackageRoute');
const dashboardOverview = require('./routes/tariffRoutes/dashboardOverviewRoute');

// Porto Route
const productViewRouter = require('./routes/porto/productViewRoutes');
const authRouter = require('./routes/auth/authRoutes');

/* Necessary variables */
const PORT = process.env.PORT || 3001;
const main = express();

main.use(cors(
    {
        origin: '*'
    }
));

main.use(bodyParser.json());
main.use(bodyParser.urlencoded ({
    extended: false
}));

main.use(authRouter);
main.use(picRouter);

// Tarif Use route
main.use('/tariff/search', searchRoute);
main.use('/tariff/sheet', sheetRoute);
main.use('/tariff/masterPackage', masterPackageRoute);
main.use('/tariff/dashboardOverview', dashboardOverview);

// Porto Use route
main.use(productViewRouter);
main.use(authRouter);

main.listen(PORT, () => {
    console.log('Server is running! port: ' + PORT);
});