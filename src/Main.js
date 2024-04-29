/* Basic properties for express, body-parser, and controllers route */
const express = require('express')
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth/auth.routes');
const stepOneRouter = require('./routes/productGuide/stepOne.routes');
const stepThreeRouter = require('./routes/productGuide/stepThree.routes');

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

main.listen(PORT, () => {
    console.log('Server is running! port: ' + PORT);
});