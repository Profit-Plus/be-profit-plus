const createOrUpdateCustomer = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 68, nullable: false },
    },
    required: ['name'],
    additionalProperties: false,
};

module.exports = { createOrUpdateCustomer };