/* Basic properties for express, body-parser, and controllers route */
require("dotenv").config();
const express = require('express')
const bodyParser = require('body-parser');
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
const sheetRoute = require('./routes/tariffRoutes/searchRoute');
const masterPackageRoute = require('./routes/tariffRoutes/masterPackageRoute');
const offeringRoute = require('./routes/tariffRoutes/offeringRoute');


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
const newSolutionRouter = require('./routes/solutionFormulation/newSolution.routes');

/* Necessary variables */
const PORT = process.env.PORT || 3001;
const main = express();

main.use(cors());
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({
    extended: false
}));

main.use('/profitplus/api', authRouter);

/* Product Management routes */
main.use('/profitplus/api', productGuideMiscRouter);
main.use('/profitplus/api', productGuideProductTemplate);
main.use('/profitplus/api', productGuidestepOneRouter);
main.use('/profitplus/api', productGuideStepTwoRouter)
main.use('/profitplus/api', productGuideStepThreeRouter);
main.use('/profitplus/api', productGuidestepFourRouter);
main.use('/profitplus/api', productGuidestepFiveRouter);
main.use('/profitplus/api', productGuideStepSixRouter);

/* Solution formulation */
main.use('/profitplus/api', newSolutionRouter);

main.listen(PORT, () => {
    console.log('Server is running! port: ' + PORT);
});