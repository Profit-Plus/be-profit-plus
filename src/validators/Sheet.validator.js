const createSheet = {
    type: 'object',
    properties: {
        name: { type: 'string', maxLength: 68, nullable: false },
    },
    required: ['name'],
    additionalProperties: false,
}

const updateSheet = {
    type: 'object',
    properties: {
        name: { type: 'string', maxLength: 68, nullable: true },
    },
    additionalProperties: false,
}

module.exports = {
    createSheet,
    updateSheet,
};