const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });

require('ajv-errors')(ajv);

ajv.addFormat("date", (data) => {
    // Regular expression for yyyy-mm-dd format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(data);
});

function isGetAllCustomersValid() {
    const dateErrorMessage = 'format should be \'yyyy-mm-dd\'';

    const schema = {
        type: 'object',
        properties: {
            start_date: { type: 'string', format: 'date', errorMessage: dateErrorMessage },
            end_date: { type: 'string', format: 'date', errorMessage: dateErrorMessage }
        },
        additionalProperties: true,
    };

    const validate = ajv.compile(schema);

    return validate;
}

function isDataCustomerValid() {
    const schema = {
        type: 'object',
        properties: {
            name: { type: 'string', minLength: 1, maxLength: 68, nullable: false },
        },
        required: ['name'],
        additionalProperties: false,
    };

    const validate = ajv.compile(schema);

    return validate;
}

module.exports = { isDataCustomerValid, isGetAllCustomersValid };