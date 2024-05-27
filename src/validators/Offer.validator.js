const updateDataOffer = {
    type: 'object',
    properties: {
        offer_name: { type: 'string', maxLength: 68, nullable: true },
        unit: { type: 'string', nullable: true },
        user_target: { type: 'number', nullable: true },
    },
    additionalProperties: false,
}

module.exports = {
    updateDataOffer,
};