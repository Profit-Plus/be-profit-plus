const updateDataCalculation = {
    type: 'object',
    properties: {
        name: { type: 'string', nullable: true },
        target_sales: { type: 'number', nullable: true },
        business_model: { type: 'string', enum: [
            'Subscription',
            'OneTimeCharge'
        ], nullable: true },
        payback_period: { type: 'number', nullable: true },
        operational_time: { type: 'number', nullable: true },
        excess_capacity: { type: 'number', nullable: true },
        unit_target: { type: 'string', enum: [
            'User',
            'Unit',
            'Project'
        ], nullable: true },
        tariff: { type: 'number', nullable: true }
    },
    additionalProperties: false
};

module.exports = {
    updateDataCalculation
};
//     type: 'object',
//     properties: {
//         name: { type: 'string', nullable: true },
//         targetSales: { type: 'number',  nullable: true },
//         businessModel: { type: 'string', enum: [
//             'Subscription',
//             'Pay-Per-Use',
//             'Freemium',
//             'One-Time Purchase',
//             'One Time Charge',
//         ], nullable: true },
//         paybackPeriod: { type: 'number', nullable: true },
//         operationalTime: { type: 'number', nullable: true },
//         excessCapacity: { type: 'number', nullable: true },
//         unitTarget: { type: 'string', enum: [
//             'User',
//             'Unit',
//             'Project',
//         ], nullable: true },
//         tariff: { type: 'number', nullable: true },
//     },
//     additionalProperties: false,
// }

// module.exports = {
//     updateDataCalculation,
// };