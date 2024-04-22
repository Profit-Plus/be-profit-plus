const createPIC = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 5, maxLength: 68, nullable: false },
        phone: { type: 'string', minLength: 5, maxLength: 13, nullable: false },
        role: { type: 'string', minLength: 5, maxLength: 68, nullable: false},
    },
    required: ['name', 'phone', 'role'],
    additionalProperties: false,
}

const updatePIC = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 5, maxLength: 68, nullable: false },
        phone: { type: 'string', minLength: 5, maxLength: 13, nullable: false },
        role: { type: 'string', minLength: 5, maxLength: 68, nullable: false},
    },
    additionalProperties: false,
}

module.exports = {
    createPIC,
    updatePIC,
};