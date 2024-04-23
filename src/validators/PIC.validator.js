const createPIC = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 68, nullable: false },
        phone: { type: 'string', minLength: 7, maxLength: 13, nullable: false },
        role: { type: 'string', enum: ["LIRA", "external", "midfielder"], minLength: 1, nullable: false },
    },
    required: ['name', 'phone', 'role'],
    additionalProperties: false,
}

const updatePIC = {
    type: 'object',
    properties: {
        name: { type: 'string', minLength: 1, maxLength: 68, nullable: false },
        phone: { type: 'string', minLength: 7, maxLength: 13, nullable: false },
        role: { type: 'string', enum: ["LIRA", "external", "midfielder"], minLength: 1, nullable: false },
    },
    additionalProperties: false,
}

module.exports = {
    createPIC,
    updatePIC,
};