const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });

require('ajv-errors')(ajv);

ajv.addFormat("date", (data) => {
    // Regular expression for yyyy-mm-dd format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(data);
})

function isGetAllDocumentsValid() {
    const dateErrorMessage = 'format should be \'yyyy-mm-dd\'';

    const schema = {
        type: 'object',
        properties: {
            start_date: { type: 'string', format: 'date', errorMessage: dateErrorMessage },
            end_date: { type: 'string', format: 'date', errorMessage: dateErrorMessage }
        },
        additionalProperties: true
    };

    const validate = ajv.compile(schema);

    return validate;
}

module.exports = { isGetAllDocumentsValid }