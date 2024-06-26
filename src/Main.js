/* Basic properties for express, body-parser, and controllers route */
require("dotenv").config();
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');


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
const createSheet = require('./routes/tariffRoutes/createSheetRoute');
const masterDataRoute = require('./routes/tariffRoutes/componentRoutes');
const CostCalculation = require('./routes/tariffRoutes/calculationRoute');

// Porto Route
const authRouter = require('./routes/authentication/auth.routes');
const productGuideProductTemplate = require('./routes/productGuideEditor/editor/templates.routes');
const productGuideMiscRouter = require('./routes/productGuideEditor/editor/misc/misc.routes');
const productGuidestepOneRouter = require('./routes/productGuideEditor/editor/step1/step1.routes');
const productGuideStepTwoRouter = require('./routes/productGuideEditor/editor/step2/step2.routes');
const productGuideStepThreeRouter = require('./routes/productGuideEditor/editor/step3/step3.routes');
const productGuidestepFourRouter = require('./routes/productGuideEditor/editor/step4/step4.routes');
const productGuidestepFiveRouter = require('./routes/productGuideEditor/editor/step5/step5.routes');
const productGuideStepSixRouter = require('./routes/productGuideEditor/editor/step6/step6.routes');
const productListRouter = require('./routes/productGuideEditor/review/productList.routes');
const newSolutionRouter = require('./routes/solutionFormulation/newSolution.routes');
const path = require('path');

/* Necessary variables */
const PORT = process.env.PORT || 3001;
const main = express();

main.use(cors());
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({
    extended: false
}));

//Auth Use route
main.use('/profitplus/api', authRouter);

// GTOM Use route
main.use('/profitplus/api', picRouter);
main.use('/profitplus/api', customerRouter);
main.use('/profitplus/api', documentRouter);
main.use('/profitplus/api', projectRouter);
main.use('/profitplus/api', commentRouter);
main.use('/profitplus/api', notificationRouter);
main.use('/profitplus/api', dashboardRouter);

// Tarif Use route
main.use('/tariff/search', searchRoute);
main.use('/tariff/sheet', sheetRoute);
main.use('/tariff/masterPackage', masterPackageRoute);
main.use('/tariff/offering', offeringRoute);
main.use('/tariff/product', productRoute);
main.use('/tariff/dashboard', dashboard);
main.use('/tariff/solution', solution);
main.use('/tariff/createSheet', createSheet);
main.use('/tariff/component', masterDataRoute);
main.use('/tariff/calculation', CostCalculation)

/* Product Management routes */
main.use('/uploads', express.static(path.join(__dirname, 'src', 'resources', 'resources', 'uploads', 'logo')));
main.use('/profitplus/api', productGuideMiscRouter);
main.use('/profitplus/api', productGuideProductTemplate);
main.use('/profitplus/api', productGuidestepOneRouter);
main.use('/profitplus/api', productGuideStepTwoRouter)
main.use('/profitplus/api', productGuideStepThreeRouter);
main.use('/profitplus/api', productGuidestepFourRouter);
main.use('/profitplus/api', productGuidestepFiveRouter);
main.use('/profitplus/api', productGuideStepSixRouter);
main.use('/profitplus/api', productListRouter);

/* Solution formulation */
main.use('/profitplus/api', newSolutionRouter);

main.get('/product/:directory/:filename', (req, res) => {
    const fileName = req.params.filename;
    const dirParam = req.params.directory;
    const dirName = __dirname.split(path.sep).pop();
    const convertedDir = __dirname.split(path.sep).slice(0, -1).join(path.sep);
    const filePath = path.join(convertedDir, 'resources', 'uploads', dirParam, fileName);
    console.log(filePath);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      // File not found
      res.status(404).send('Image not found');
    }
});


/* Solution formulation */
main.use('/profitplus/api', newSolutionRouter);

main.listen(PORT, () => {
    console.log('Server is running! port: ' + PORT);
});