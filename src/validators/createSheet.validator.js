// validators/createSheet.validator.js
const createSheetSchema = {
    type: 'object',
    properties: {
        name: { type: 'string', maxLength: 100 },
        taxonomy: { type: 'integer' }
    },
    required: ['name', 'taxonomy'],
    additionalProperties: false
};

module.exports = {
    createSheetSchema
};
