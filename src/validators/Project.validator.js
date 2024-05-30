const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });

require('ajv-errors')(ajv);

ajv.addFormat("date", (data) => {
    // Regular expression for yyyy-mm-dd format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(data);
});

function isCreateProjectValid() {
    const dateErrorMessage = 'format should be \'yyyy-mm-dd\'';

    const schema = {
        type: 'object',
        properties: {
            project: {
                type: 'object',
                properties: {
                    start_project: { type: 'string', format: 'date', errorMessage: dateErrorMessage },
                    end_project: { type: 'string', format: 'date', errorMessage: dateErrorMessage },
                    topic: { type: 'string', minLength: 1 },
                    segment: { type: 'string', enum: ['DPS', 'DGS', 'DSS'] },
                    customer_id: { type: 'string' },
                    pic_external_id: { type: 'string' },
                    pic_lira_id: { type: 'string' },
                    tariff: { type: 'integer' }
                },
                required: ['start_project', 'end_project', 'customer_id', 'topic', 'pic_external_id', 'pic_lira_id', 'segment', 'tariff']
            },
            solution: {
                type: 'object',
                properties: {
                    solution_name: { type: 'string', minLength: 1 },
                    items: { type: 'array' }
                },
                required: ['solution_name', 'items']
            }
        },
        additionalProperties: true
    };

    const validate = ajv.compile(schema);

    return validate;
};

function isUpdateProjectValid() {
    const dateErrorMessage = 'format should be \'yyyy-mm-dd\'';

    const schema = {
        type: 'object',
        properties: {
            project: {
                type: 'object',
                properties: {
                    start_project: { type: 'string', format: 'date', errorMessage: dateErrorMessage },
                    end_project: { type: 'string', format: 'date', errorMessage: dateErrorMessage },
                    topic: { type: 'string', minLength: 1 },
                    segment: { type: 'string', enum: ['DPS', 'DGS', 'DSS'] },
                    customer_id: { type: 'string' },
                    pic_external_id: { type: 'string' },
                    pic_lira_id: { type: 'string' },
                    tariff: { type: 'integer' }
                }
            },
            project_init: {
                type: 'object',
                properties: {
                    helix: { type: 'string', enum: ['academy', 'business', 'goverment', 'community', 'tech_prov', 'subsidiary'] },
                    nde_request_id: { type: 'string' },
                    midfielder: { type: 'string' },
                    related_unit: { type: 'string' },
                    pic_midfielder_id: { type: 'string' },
                    mom_req_id: { type: 'string' },
                    lir_requirement_id: { type: 'string' },
                    sph_id: { type: 'string' },
                    spk_id: { type: 'string' },
                    requester: { type: 'string' },
                    impact: { type: 'string' },
                    potential_employee_trained: { type: 'integer' },
                    nde_determination_id: { type: 'string' },
                    potential_revenue: { type: 'integer' },
                }
            },
            project_ongoing: {
                type: 'object',
                properties: {
                    nde_req_cfu_to_mid_id: { type: 'string' },
                    nde_req_mid_to_tcuc_id: { type: 'string' },
                    UIC: { type: 'string' },
                    start_access: { type: 'string', format: 'date', errorMessage: dateErrorMessage },
                    end_access: { type: 'string', format: 'date', errorMessage: dateErrorMessage },
                    mom_readiness_id: { type: 'string' },
                    nde_confirmation_id: { type: 'string' },
                    baa_id: { type: 'string' },
                    bast_id: { type: 'string' },
                }
            },
            project_drop: {
                type: 'object',
                properties: {
                    nde_project_drop_id: { type: 'string' },
                }
            },
            project_close_out: {
                type: 'object',
                properties: {
                    mom_reconciles_id: { type: 'string' },
                    nde_revenue_recognition_id: { type: 'string' },
                    employee_trained: { type: 'integer' },
                    revenue_in: { type: 'integer' },
                    report_project_id: { type: 'string' },
                    nde_report_project_id: { type: 'string' },
                    nps_id: { type: 'string' },
                    delivery_year: { type: 'string' },
                }
            },
            solution: {
                type: 'object',
                properties: {
                    solution_name: { type: 'string' },
                    items: { type: 'array' }
                }
            }
        },
        additionalProperties: true
    };

    const validate = ajv.compile(schema);

    return validate;
};

function isGetAllProjectValid() {
    const dateErrorMessage = 'format should be \'yyyy-mm-dd\'';

    const schema = {
        type: 'object',
        properties: {
            status: { type: 'string', enum: ['initiation', 'ongoing', 'close_out', 'drop', 'hold'] },
            start_date: { type: 'string', format: 'date', errorMessage: dateErrorMessage },
            end_date: { type: 'string', format: 'date', errorMessage: dateErrorMessage },
            requesting_approval: { type: 'boolean' }
        },
        additionalProperties: true
    };

    const validate = ajv.compile(schema);

    return validate;
};

module.exports = {
    isCreateProjectValid,
    isUpdateProjectValid,
    isGetAllProjectValid
};