const createData = {
    type: 'object',
    properties: {
        event_module : { type: 'string', maxLength: 68 },
        code : { type: 'string', nullable: true },
        unit : { type: 'string', nullable: true },
        grade : { type: 'string',  enum: [
            'Basic',
            'Entry',
            'Enterprise',
            'Exclusive',
            'Executive',
            'Medium',
            'Minimalist',
            'Premium',
            'Professional',
            'Standard',
        ], nullable: true },
    },
    required: ['event_module'],
    additionalProperties: false,
};

const createComponent = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            name: { type: 'string', maxLength: 68 },
            item: { type: 'string', nullable: true },
            unit: { type: 'integer', nullable: true },
            specs: { type: 'string', nullable: true },
            price_per_unit: { type: 'number', nullable: true },
            quantity: { type: 'integer', nullable: true },
            note: { type: 'string', nullable: true }
        },
        required: ['name'],
        additionalProperties: false,
    }
};

const updateData = {
    type: 'object',
    properties: {
        event_module: { type: 'string', maxLength: 68, nullable: true },
        unit: { type: 'string', nullable: true },
        code: { type: 'string', nullable: true },
        grade : { type: 'string',  enum: [
            'Basic',
            'Entry',
            'Enterprise',
            'Exclusive',
            'Executive',
            'Medium',
            'Minimalist',
            'Premium',
            'Professional',
            'Standard',
        ], nullable: true },
    },
    additionalProperties: false,
};

const updateComponent = {
    type: 'object',
    properties: {
        name: { type: 'string', maxLength: 68, nullable: true },
        item: { type: 'string', nullable: true },
        unit: { type: 'integer', nullable: true },
        specs: { type: 'string', nullable: true },
        price_per_unit: { type: 'number', nullable: true },
        quantity: { type: 'integer', nullable: true },
        note: { type: 'string', nullable: true }
    },
    additionalProperties: false,
};

module.exports = {
    createData,
    createComponent,
    updateData,
    updateComponent
};



// const createData = {
//     type: 'object',
//     properties: {
//         eventModule : { type: 'string', maxLength: 68 },
//         code : { type: 'string', nullable: true },
//         unit : { type: 'string', nullable: true },
//         grade : { type: 'string',  enum: [
//             'Basic',
//             'Entry',
//             'Enterprise',
//             'Exclusive',
//             'Executive',
//             'Medium',
//             'Minimalist',
//             'Premium',
//             'Professional',
//             'Standard',
//         ], nullable: true },
//     },
//     required: ['eventModule'],
//     additionalProperties: false,
// };

// const createComponent = {
//     type: 'array',
//     items: {
//         type: 'object',
//         properties: {
//             name: { type: 'string', maxLength: 68 },
//             item: { type: 'string', nullable: true },
//             unit: { type: 'integer', nullable: true },
//             specs: { type: 'string', nullable: true },
//             pricePerUnit: { type: 'number', nullable: true },
//             quantity: { type: 'integer', nullable: true },
//             note: { type: 'string', nullable: true }
//         },
//         required: ['name'],
//         additionalProperties: false,
//     }
// };

// const updateData = {
//     type: 'object',
//     properties: {
//         eventModule: { type: 'string', maxLength: 68, nullable: true },
//         unit: { type: 'string', nullable: true },
//         code: { type: 'string', nullable: true },
//         grade : { type: 'string',  enum: [
//             'Basic',
//             'Entry',
//             'Enterprise',
//             'Exclusive',
//             'Executive',
//             'Medium',
//             'Minimalist',
//             'Premium',
//             'Professional',
//             'Standard',
//         ], nullable: true },
//     },
//     additionalProperties: false,
// };

// const updateComponent = {
//     type: 'object',
//     properties: {
//         name: { type: 'string', maxLength: 68, nullable: true },
//         item: { type: 'string', nullable: true },
//         unit: { type: 'integer', nullable: true },
//         specs: { type: 'string', nullable: true },
//         pricePerUnit: { type: 'number', nullable: true },
//         quantity: { type: 'integer', nullable: true },
//         note: { type: 'string', nullable: true }
//     },
//     additionalProperties: false,
// };

// module.exports = {
//     createData,
//     createComponent,
//     updateData,
//     updateComponent
// };
