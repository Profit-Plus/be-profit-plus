// const updateCategory = {
//     type: 'object',
//     properties: {
//         id: { type: 'number',  nullable: false },
//         type: { type: 'string',  nullable: false },
//         category: { type: 'string', maxLength: 68, nullable: false },
//     },
//     additionalProperties: false,
// };

// const createNewCategory = {
//     type: 'object',
//     properties: {
//         type: { type: 'string',  nullable: false },
//         category: { type: 'string', maxLength: 68, nullable: false },
//     },
//     additionalProperties: false,
// };

const upsertCategory = {
    type: 'object',
    properties: {
        id: { type: 'number',  nullable: false },
        type: { type: 'string',  nullable: false },
        category: { type: 'string', maxLength: 68, nullable: false },
    },
    additionalProperties: false,
};

const connectData = {
    type: 'object',
    properties: {
        newDataId: { type: 'number',  nullable: false },
        oldDataId: { type: 'number',  nullable: false },
        categoryId: { type: 'number',  nullable: false },
    },
    additionalProperties: false,
};

const createNewPackage = {
    type: 'object',
    properties: {
        name: { type: 'string', maxLength: 68, nullable: false },
        category: { type: 'string', maxLength: 68, nullable: false },
    },
    additionalProperties: false,
};

const updatePackage = {
    type: 'object',
    properties: {
        id: { type: 'number',  nullable: false },
        name: { type: 'string', maxLength: 68, nullable: false },
        category: { type: 'string', maxLength: 68, nullable: false },
    },
    additionalProperties: false,
};

const updateTotal = {
    type: 'object',
    properties: {
        packageId: { type: 'number',  nullable: false },
        type: { type: 'string',  nullable: false },
        total: { type: 'number',  nullable: false },
    },
    additionalProperties: false,
};

const updateDataPackage = {
    type: 'object',
    properties: {
        dataId: { type: 'number',  nullable: false },
        packageId: { type: 'number',  nullable: false },
        quantity: { type: 'number',  nullable: false },
        frequency: { type: 'number',  nullable: false },
        excess: { type: 'number',  nullable: false },
        total: { type: 'number',  nullable: false },
        information: { type: 'string',  nullable: false },
    },
    additionalProperties: false,
};

const deleteRow = {
    type: 'object',
    properties: {
        categoryId: { type: 'number',  nullable: false },
        dataId: { type: 'number',  nullable: false },
    },
    additionalProperties: false,
};


module.exports = {
    // updateCategory,
    // createNewCategory,
    upsertCategory,
    connectData,
    createNewPackage,
    updatePackage,
    updateTotal,
    updateDataPackage,
    deleteRow
};