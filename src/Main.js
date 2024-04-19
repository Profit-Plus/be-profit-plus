/* Basic properties for express, body-parser, and controllers route */
const express = require('express')
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth/auth.routes');
const productGuideRouter = require('./routes/productGuide/productGuide.routes');

/* Necessary variables */
const PORT = process.env.PORT || 3001;
const main = express();

main.use(bodyParser.json());
main.use(bodyParser.urlencoded ({
    extended: false
}));

main.use(authRouter);
main.use(productGuideRouter);

main.listen(PORT, () => {
    console.log('Server is running! port: ' + PORT);
});