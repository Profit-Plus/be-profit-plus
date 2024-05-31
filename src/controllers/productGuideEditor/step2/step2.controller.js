const stepTwoService = require('../../../services/productGuideEditor/step2/step2.service');
const response = require('../../../helpers/web/webResponses');

const { Prisma } = require("@prisma/client");
const formidable = require('formidable');
const { v4: uuidv4 } = require('uuid');
const filestream = require('fs');
const path = require('path');
const mv = require('mv');



