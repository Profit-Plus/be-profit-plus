const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });

function isGetDashboardValid() {
    const schema = {
        type: 'object',
        properties: {
            quarter: { type: 'string', enum: ['1', '2', '3', '4'] },
            year: { type: 'string', minLength: 4 }
        },
        required: ['quarter', 'year'],
        additionalProperties: false
    };

    const validate = ajv.compile(schema);

    return validate;
}

module.exports = { isGetDashboardValid }