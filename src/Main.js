/* Basic properties for express, body-parser, and controllers route */
const express = require('express')
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth/auth.routes');
const stepOneRouter = require('./routes/productGuide/stepOne.routes');
const stepTwoRouter = require('./routes/productGuide/stepOne.routes');
const stepThreeRouter = require('./routes/productGuide/stepTwo.routes');

/* Necessary variables */
const PORT = process.env.PORT || 3001;
const main = express();

main.use(bodyParser.json());
main.use(bodyParser.urlencoded ({
    extended: false
}));

main.use(authRouter);
main.use(stepOneRouter);
main.use(stepThreeRouter);
main.use(stepTwoRouter);

main.listen(PORT, () => {
    console.log('Server is running! port: ' + PORT);
});