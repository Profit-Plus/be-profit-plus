/* Basic properties for express, body-parser, and controllers route */
const express = require('express')
const bodyParser = require('body-parser');
const productViewRouter = require('./routes/porto/productView');
const authRouter = require('./routes/auth/authRoutes');

/* Necessary variables */
const PORT = process.env.PORT || 3001;
const main = express();

main.use(bodyParser.json());
main.use(bodyParser.urlencoded ({
    extended: false
}));

main.use(productViewRouter);
main.use(authRouter);

main.listen(PORT, () => {
    console.log('Server is running! port: ' + PORT);
});