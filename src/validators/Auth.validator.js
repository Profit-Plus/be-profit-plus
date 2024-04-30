const register = {
    type: 'object',
    properties: {
        email: { type: 'string',maxLength: 68, minLength: 9, nullable: false },
        password: { type: 'string', minLength: 8, maxLength: 18, nullable: false },
        display_name: { type: 'string', minLength: 3, maxLength: 68, nullable: false },
        unit: { type: 'string', minLength: 1, maxLength: 68, nullable: true },
        team: { type: 'string', minLength: 1, maxLength: 68, nullable: true },
        level: { type: 'string', minLength: 1, maxLength: 68, nullable: true },
    },
    required: ['email', 'password'],
    additionalProperties: false,
};

const login = {
    type: 'object',
    properties: {
        email: { type: 'string',maxLength: 68, minLength: 9 , format: 'email', nullable: false },
        password: { type: 'string', minLength: 8, maxLength: 18, nullable: false },
    },
    required: ['email', 'password'],
    additionalProperties: false,
};

const refreshToken = {
    type: 'object',
    properties: {
        refreshToken: { type: 'string', nullable: false },
    },
    required: ['refreshToken'],
    additionalProperties: false,
};

module.exports = {
    register,
    login,
    refreshToken,
};