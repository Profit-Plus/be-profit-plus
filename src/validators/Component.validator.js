const createComponentSchema = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        code: { type: 'string' },
        item: { type: 'string' },
        specs: { type: 'string' },
        unit: { type: 'number' },
        price_per_unit: { type: 'number' },
        quantity: { type: 'number' },
        note: { type: 'string', default: '-' },
    },
    required: ['name'],
    additionalProperties: false,
};

const updateComponentSchema = {
    type: 'object',
    properties: {
        name: { type: 'string' },
        code: { type: 'string' },
        item: { type: 'string' },
        specs: { type: 'string' },
        unit: { type: 'number' },
        price_per_unit: { type: 'number' },
        quantity: { type: 'number' },
        note: { type: 'string', default: '-' },
    },
    additionalProperties: false,
};

module.exports = {
    createComponentSchema,
    updateComponentSchema,
};

// // validators/componentValidator.js
// const createComponentSchema = {
//     type: 'object',
//     properties: {
//         name: { type: 'string' },
//         code: { type: 'string' },
//         item: { type: 'string' },
//         specs: { type: 'string' },
//         unit: { type: 'number' },
//         pricePerUnit: { type: 'number' },
//         quantity: { type: 'number' },
//         note: { type: 'string', default: '-' },
//     },
//     required: ['name'],
//     additionalProperties: false,
// };

// const updateComponentSchema = {
//     type: 'object',
//     properties: {
//         name: { type: 'string' },
//         code: { type: 'string' },
//         item: { type: 'string' },
//         specs: { type: 'string' },
//         unit: { type: 'number' },
//         pricePerUnit: { type: 'number' },
//         quantity: { type: 'number' },
//         note: { type: 'string', default: '-' },
//     },
//     additionalProperties: false,
// };

// module.exports = {
//     createComponentSchema,
//     updateComponentSchema,
// };
