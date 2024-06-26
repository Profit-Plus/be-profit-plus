const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });

require('ajv-errors')(ajv);

ajv.addFormat("date", (data) => {
    // Regular expression for yyyy-mm-dd format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(data);
});

function isGetAllCommentsValid() {
    const dateErrorMessage = 'format should be \'yyyy-mm-dd\'';

    const schema = {
        type: 'object',
        properties: {
            project_id: { type: 'string' },
            comment_type: { type: 'string', enum: ['comment', 'log'] },
            start_date: { type: 'string', format: 'date', errorMessage: dateErrorMessage },
            end_date: { type: 'string', format: 'date', errorMessage: dateErrorMessage }
        },
        required: ['project_id'],
        additionalProperties: true
    };

    const validate = ajv.compile(schema);

    return validate;
}

function isCreateCommentValid() {
    const schema = {
        type: 'object',
        properties: {
            message: { type: 'string', minLength: 1, maxLength: 68, nullable: false },
            project_id: { type: 'string' }
        },
        required: ['message', 'project_id'],
        additionalProperties: false
    };

    const validate = ajv.compile(schema);

    return validate;
}

function isUpdateCommentValid() {
    const schema = {
        type: 'object',
        properties: {
            message: { type: 'string', minLength: 1, maxLength: 68, nullable: false },
        },
        required: ['message'],
        additionalProperties: false
    };

    const validate = ajv.compile(schema);

    return validate;
}

module.exports = { isCreateCommentValid, isUpdateCommentValid, isGetAllCommentsValid }