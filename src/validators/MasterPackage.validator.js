const updateData = {
    type: 'object',
    properties: {
        event_module: { type: 'string', maxLength: 68, nullable: true },
        nature: { type: 'string', maxLength: 68, nullable: true },
        unit: { type: 'string', maxLength: 24, nullable: true },
        code: { type: 'string', maxLength: 24, nullable: true },
        grade: { type: 'string', maxLength: 24, nullable: true },
        category_id: { type: 'number', nullable: true },
    },
    additionalProperties: false,
};

const updateComponent = {
    type: 'object',
    properties: {
        name: { type: 'string', maxLength: 68, nullable: true },
        item: { type: 'string', maxLength: 68, nullable: true },
        unit: { type: 'string', maxLength: 24, nullable: true },
        specs: { type: 'string', maxLength: 68, nullable: true },
        priceperunit: { type: 'number', nullable: true },
        quantity: { type: 'number', nullable: true },
        data_id: { type: 'number', nullable: true },
    },
    additionalProperties: false,
};

module.exports = {
    updateData,
    updateComponent,
};