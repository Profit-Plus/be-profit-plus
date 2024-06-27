const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });

require('ajv-errors')(ajv);

ajv.addFormat("date", (data) => {
    // Regular expression for yyyy-mm-dd format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(data);
});

function isGetAllNotificationsValid() {
    const dateErrorMessage = 'format should be \'yyyy-mm-dd\'';

    const schema = {
        type: 'object',
        properties: {
            receiver_id: { type: 'string' },
            start_date: { type: 'string', format: 'date', errorMessage: dateErrorMessage },
            end_date: { type: 'string', format: 'date', errorMessage: dateErrorMessage },
            read: { type: 'boolean' }
        },
        required: ['receiver_id'],
        additionalProperties: true
    };

    const validate = ajv.compile(schema);

    return validate;
}

function isCreateNotificationValid() {
    const schema = {
        type: 'object',
        properties: {
            header: { type: 'string', minLength: 1, maxLength: 68 },
            content: { type: 'string', minLength: 1, maxLength: 68 },
            receiver_id: { type: 'string' }
        },
        required: ['receiver_id', 'header', 'content'],
        additionalProperties: true
    };

    const validate = ajv.compile(schema);

    return validate;
}

function isUpdateNotificationValid() {
    const schema = {
        type: 'object',
        properties: {
            header: { type: 'string', minLength: 1, maxLength: 68 },
            content: { type: 'string', minLength: 1, maxLength: 68 },
            receiver_id: { type: 'string' },
            read: { type: 'boolean' }
        },
        additionalProperties: true
    };

    const validate = ajv.compile(schema);

    return validate;
}

module.exports = { isCreateNotificationValid, isGetAllNotificationsValid, isUpdateNotificationValid }