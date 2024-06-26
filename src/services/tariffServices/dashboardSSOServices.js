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
            data_collection_boolean: true,       
            data_calculation: true,
            data_calculation_boolean: true,
            draft_tariff_validation: true,
            draft_tariff_validation_boolean: true,
            presentation_draft_tariff: true,
            presentation_draft_tariff_boolean: true,
            request_draft_tariff: true,
            request_draft_tariff_boolean: true,
            NDE_determination_tariff: true,
            NDE_determination_tariff_boolean: true,
            work_time: true,
            work_time_num: true,
            achievement: true,
            progress: true,
            description: true,   
            evidence_tariff_link: true,
            evidence_tariff_text: true,         
            sheet_id: true,
            sheet: {
                select: {
                    name: true
                }
            },
            product_id: true,
            product:{
                select: {
                    name: true,
                    description: true,                
                    product_sheet: {
                        select: {
                            taxonomy: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
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
            data_collection_boolean:sso.data_collection_boolean,
            data_calculation:sso.data_calculation,
            data_calculation_boolean:sso.data_calculation_boolean,
            draft_tariff_validation:sso.draft_tariff_validation,
            draft_tariff_validation_boolean:sso.draft_tariff_validation_boolean,
            presentation_draft_tariff:sso.presentation_draft_tariff,
            presentation_draft_tariff_boolean:sso.presentation_draft_tariff_boolean,
            request_draft_tariff:sso.request_draft_tariff,
            request_draft_tariff_boolean:sso.request_draft_tariff_boolean,
            NDE_determination_tariff:sso.NDE_determination_tariff,
            NDE_determination_tariff_boolean:sso.NDE_determination_tariff_boolean,
            work_time:sso.work_time,
            work_time_num:sso.work_time_num,
            achievement:sso.achievement,
            progress:sso.progress,
            description:sso.description,            
            sheet:sso.sheet.name,
            sheet_id:sso.sheet_id,
            product:sso.product.name,
            product_id:sso.product_id,
            requester:sso.requester.name,
            requester_id:sso.requester.id,
            pic:sso.pic.username,
            pic_id:sso.pic.id,
            owner:sso.owner.name,
            owner_id:sso.owner.id,
            taxonomy: sso.product.product_sheet[0]?.taxonomy.name || null,
            evidence_tariff_link:sso.evidence_tariff_link,
            evidence_tariff_text:sso.evidence_tariff_text
        });    
        }

    return result;
}

async function getUnit() {
    return database.unit.findMany({
        select: {
            id: true,
            name: true
        }
    })
}

async function getSheet() {
    return database.sheet.findMany({
        select: {
            id: true,
            name: true
        }
    })
}

async function getUser() {
    return database.user.findMany({
        select: {
            id: true,
            username: true
        }
    })
}

async function createSso(product_id){
    return database.sso.create({
        data: {
            product_id
        }
    });
}

async function updateSso(
    id,
    sheet_id,
    product_id,
    owner_id,
    pic_id,
    requester_id,
    NDE_determination_tariff,
    NDE_determination_tariff_boolean,
    achievement,
    business_model,
    data_calculation,
    data_calculation_boolean,
    data_collection,
    data_collection_boolean,
    description,
    draft_tariff_validation,
    draft_tariff_validation_boolean,
    evidence_tariff_link,
    evidence_tariff_text,
    presentation_draft_tariff,
    presentation_draft_tariff_boolean,
    progress, 
    request_draft_tariff,
    request_draft_tariff_boolean,    
    status,
    status_hold,
    time_end,
    time_start,
    work_time,
    work_time_num,
    year
)
{
    return database.sso.update({
        where: { id },
        data: {            
            sheet: {
                connect: { id: sheet_id }
            },
            product: {
                connect: { id: product_id }
            },
            owner: {
                connect: { id: owner_id }
            },
            pic: {
                connect: { id: pic_id }
            },
            requester: {
                connect: { id: requester_id }
            },

            NDE_determination_tariff,
            NDE_determination_tariff_boolean,
            achievement,
            business_model,
            data_calculation,
            data_calculation_boolean,
            data_collection,
            data_collection_boolean,
            description,
            draft_tariff_validation,
            draft_tariff_validation_boolean,
            evidence_tariff_link,
            evidence_tariff_text,
            presentation_draft_tariff,
            presentation_draft_tariff_boolean,
            progress, 
            request_draft_tariff,
            request_draft_tariff_boolean,    
            status,
            status_hold,
            time_end,
            time_start,
            work_time,
            work_time_num,
            year
        }
    });
}



module.exports = {
    getSso,
    getSheet,
    getUnit,
    getUser,
    createSso,
    updateSso,
};