const updateDataCalculation = {
    type: 'object',
    properties: {
        name: { type: 'string', nullable: true },
        target_sales: { type: 'number', nullable: true },
        business_model: { type: 'string', enum: [
            'Subscription',
            'OneTimeCharge',
            'Freemium',
            'Licensing',
            'Pay_per_Use',
        ], nullable: true },
        payback_period: { type: 'number', nullable: true },
        operational_time: { type: 'number', nullable: true },
        excess_capacity: { type: 'number', nullable: true },
        unit_target: { type: 'string', enum: [
            'User',
            'Unit',
            'Project'
        ], nullable: true },
        capex: { type: 'number', nullable: true },
        opex: { type: 'number', nullable: true },
        cogs: { type: 'number', nullable: true },
        tariff: { type: 'number', nullable: true }
    },
    additionalProperties: false
};

module.exports = {
    updateDataCalculation
};