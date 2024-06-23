const { CLIENT_RENEG_LIMIT } = require('tls');
const { database } = require('../../helpers/utils/db/database');

async function getSso() {
    const ssoResult = await database.sso.findMany({
        select: {
            id: true,
            time_start: true,
            time_end: true,
            createdAt: true,
            updatedAt: true,
            business_model: true,
            year:true,
            status: true,
            status_hold: true,
            data_collection: true,
            data_calculation: true,
            draft_tariff_validation: true,
            presentation_draft_tariff: true,
            request_draft_tariff: true,
            NDE_determination_tariff: true,
            work_time: true,
            archivement: true,
            description: true,
            sheet_id: true,
            product:{
                select: {
                    id: true,
                    name: true,
                    description: true,
                }
            },
            requester:{
                select: {
                    id: true,
                    name: true,
                }
            },
            pic:{
                select: {
                    id: true,
                    username: true,
                }
            },
            owner:{
                select: {
                    id: true,
                    name: true,
                }
            },
        }
    });
    const result = []

    for (ssoKey in ssoResult){
        const sso = ssoResult[ssoKey];

        result.push({
            id:sso.id,
            time_start:sso.time_start,
            time_end:sso.time_end,
            business_model:sso.business_model,
            year:sso.year,
            status:sso.status,
            status_hold:sso.status_hold,
            data_collection:sso.data_collection,
            data_calculation:sso.data_calculation,
            draft_tariff_validation:sso.draft_tariff_validation,
            presentation_draft_tariff:sso.presentation_draft_tariff,
            request_draft_tariff:sso.request_draft_tariff,
            NDE_determination_tariff:sso.NDE_determination_tariff,
            work_time:sso.work_time,
            archivement:sso.archivement,
            description:sso.description,
            sheet_id:sso.sheet_id,
            product:sso.product.name,
            requester:sso.requester.name,
            pic:sso.pic.username,
            owner:sso.owner.name,
        });    
        }

    return result;
}

async function createSso(product_id){
    return database.sso.create({
        data: {
            product_id
        }
    });
}

async function updateSso(id, time_start, time_end, business_model, year, status, status_hold, data_collection, data_calculation, draft_tariff_validation, presentation_draft_tariff, request_draft_tariff, NDE_determination_tariff, work_time, archivement, description, sheet_id, product_id, requester_id, pic_id, owner_id){
    return database.sso.update({
        where: { id },
        data: {
            time_start,
            time_end,
            business_model,
            year,
            status,
            status_hold,
            data_collection,
            data_calculation,
            draft_tariff_validation,
            presentation_draft_tariff,
            request_draft_tariff,
            NDE_determination_tariff,
            work_time,
            archivement,
            description,
            sheet_id,
            product_id,
            requester_id,
            pic_id,
            owner_id,
        }
    });
}



module.exports = {
    getSso,
    createSso,
    updateSso
};