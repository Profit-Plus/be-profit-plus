
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
            product_overview:{
                select: {
                    product_uuid: true,
                    product_name: true
                }
            },
            requester:{
                select:{
                    unit_id:true,
                    units_name:true
                }
            },
            pic:{
                select:{
                    user_id:true,
                    access_credentials:{
                        select:{
                            user_name:true
                        }
                    }
                }
            },
            owner:{
                select:{
                    unit_id:true,
                    units_name:true
                }
            },
        }
    });

    console.log(ssoResult);
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
            product:sso.product_overview.product_name,
            requester:sso.requester.units_name,
            pic:sso.pic.access_credentials.user_name,
            owner:sso.owner.units_name,
        });    
        }

    return result;
}

async function getSsoById(id){
    return database.sso.findUnique({
        where: {
            id,
        },
    });
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
    updateSso,
    getSsoById
};