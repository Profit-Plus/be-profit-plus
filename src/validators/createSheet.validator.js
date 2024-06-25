// validators/createSheet.validator.js
const createSheetSchema = {
    type: 'object',
    properties: {
        name: { type: 'string', maxLength: 100 },
        taxonomyName: { type: 'string', maxLength: 100 }
    },
    required: ['name', 'taxonomyName'],
    additionalProperties: false
};

module.exports = {
    createSheetSchema
};