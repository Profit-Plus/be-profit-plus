// const updateDataCalculation = {
//     type: 'object',
//     properties: {
//         targetSales: { 
//             type: 'number', 
//             nullable: true,
//             minimum: 0 
//         },
//         paybackPeriod: { 
//             type: 'number', 
//             nullable: true,
//             minimum: 0 
//         },
//         operationalTime: { 
//             type: 'number', 
//             nullable: true,
//             minimum: 0 
//         },
//         excessCapacity: { 
//             type: 'number', 
//             nullable: true,
//             minimum: 0 
//         },
//         businessModel: {
//             type: 'string',
//             enum: ['Subscription', 'OneTimeCharge'],
//             nullable: true
//         },
//         unitTarget: {
//             type: 'string',
//             enum: ['User', 'Unit', 'Project'],
//             nullable: true
//         },
//         tariff:{ 
//             type: 'number', 
//             nullable: true,
//             minimum: 0 
//         },
//     },
//     additionalProperties: false,
// }

// module.exports = {
//     updateDataCalculation,
// };
const updateDataCalculation = {
    type: 'object',
    properties: {
        name: { type: 'string', nullable: true },
        targetSales: { type: 'number',  nullable: true },
        businessModel: { type: 'string', enum: [
            'Subscription',
            'Pay-Per-Use',
            'Freemium',
            'One-Time Purchase',
            'One Time Charge',
        ], nullable: true },
        paybackPeriod: { type: 'number', nullable: true },
        operationalTime: { type: 'number', nullable: true },
        excessCapacity: { type: 'number', nullable: true },
        unitTarget: { type: 'string', enum: [
            'User',
            'Unit',
            'Project',
        ], nullable: true },
        tariff: { type: 'number', nullable: true },
    },
    additionalProperties: false,
}

module.exports = {
    updateDataCalculation,
};