
const { database } = require('../../helpers/utils/db/database');


async function createProductSheet(query_sheet_id, query_product_id, query_taxonomy_id) {
      const newProductSheet = await database.product_sheet.create({
        data: {
          sheet: {
            connect: {
                id: query_sheet_id
            }
          },
            product: {
                connect: {
                    id: query_product_id
                }
            },
            taxonomy: {
                connect: {
                    id: query_taxonomy_id
                }
            },
            sub_taxonomy: {
                connect: {
                    id: 1
                }
            },
            owner: {
                connect: {
                    id: 1
                }
            },
            requester: {
                connect: {
                    id: 1
                }
            },
            reviewer: {
                connect: {
                    id: 1
                }
            },
            drafer: {
                connect: {
                    id: 1
                }
            },
            approver: {
                connect: {
                    id: 1
                }
            },
        },
      });

      return newProductSheet;
}

async function getProductSheet(query_sheet_id) {
    const product = await database.product_sheet.findFirst({
        select:{
            id:true,
            nomor: true,
            limitation:true,
            recommendation:true,
            taxonomy: {
                select: {
                    taxonomy_uuid: true,
                    taxonomy_name: true
                }
            },
            sub_taxonomy:{
                select:{
                    id:true,
                    name:true
                }
            },
            product_overview:{
                select:{
                    product_uuid:true,
                    product_name:true
                } 
            },
            owner:{
                select:{
                    unit_id:true,
                    units_name:true
                }
            },
            owner_status:true,
            requester:{
                select:{
                    unit_id:true,
                    units_name:true
                }
            },
            requester_status:true,
            reviewer:{
                select:{
                    user_id:true,
                    access_credentials:{
                        select:{
                            user_name:true
                        }
                    }
                }
            },
            reviewer_status:true,
            drafter:{
                select:{
                    user_id:true,
                    access_credentials:{
                        select:{
                            user_name:true
                        }
                    }
                }
            },
            drafter_status:true,
            approver:{
                select:{
                    user_id:true,
                    access_credentials:{
                        select:{
                            user_name:true
                        }
                    }
                }
            },
            approver_status:true,
            updatedAt: true,
        },
        where: {
            sheet_id: query_sheet_id
        }
    });

    let product_id = 0;
    let product_name = "";

    if (product.product_overview !== null){
        product_id = product.product_overview.product_uuid;
        product_name = product.product_overview.product_name;
    }

    const result = {
        id: product.id,
        nomor: product.nomor,
        limitation: product.limitation,
        recommendation: product.recommendation,
        taxonomy: {
            id:product.taxonomy.taxonomy_uuid,
            name:product.taxonomy.taxonomy_name
        },
        sub_taxonomy: {
            id: product.sub_taxonomy.id,
            name: product.sub_taxonomy.name
        },
        product_overview:{
            id:product_id,
            name:product_name
        } ,
        owner: {
            id:product.owner.unit_id,
            name:product.owner.units_name
        },
        owner_status: product.owner_status,
        requester: {
            id:product.requester.unit_id,
            name:product.requester.units_name
        },
        requester_status: product.requester_status,
        reviewer: {
            id:product.reviewer.user_id,
            username:product.reviewer.access_credentials.user_name
        },
        reviewer_status: product.reviewer_status,
        drafter: {
            id:product.reviewer.user_id,
            username:product.reviewer.access_credentials.user_name
        },
        drafter_status: product.drafter_status,
        approver: {
            id:product.reviewer.user_id,
            username:product.reviewer.access_credentials.user_name
        },
        approver_status: product.approver_status,
        updatedAt: product.updatedAt
    }

    return result;
}

async function updateProductSheet(query_sheet_id, req) {
    return await database.product_sheet.update({
        where: {
            sheet_id: query_sheet_id
        },
        data: {
            nomor: req.nomor,
            limitation: req.limitation,
            recommendation: req.recommendation,
            sub_taxonomy: {
                connect: {
                    id: req.sub_taxonomy_id
                }
            },
            owner: {
                connect: {
                    unit_id: req.owner_id
                }
            },
            owner_status: req.owner_status,
            requester: {
                connect: {
                    unit_id: req.requester_id
                }
            },
            requester_status: req.requester_status,
            reviewer: {
                connect: {
                    user_id: req.reviewer_id
                }
            },
            reviewer_status: req.reviewer_status,
            drafter: {
                connect: {
                    user_id: req.drafter_id,
                }
            },
            drafter_status: req.drafter_status,
            approver: {
                connect: {
                    user_id: req.approver_id
                }
            },
            approver_status: req.approver_status
        }
    });
}

async function getTaxonomy(){
    return await database.taxonomy.findMany({
        select: {
            taxonomy_uuid: true,
            taxonomy_name: true
        }
    });
}

async function getSubTaxonomy(query_taxonomy_id){
    return await database.sub_taxonomy.findMany({
        select: {
            id: true,
            name: true
        },
        where: {
            taxonomy_id: query_taxonomy_id
        }
    });
}

async function getUser(){
    const user = await database.users.findMany({
        select: {
            user_id: true,
            access_credentials:{
                select:{
                    user_name: true
                }
            }
        },
    });

    let result = [];
    for (let i = 0; i < user.length; i++){
        result.push({
            id: user[i].user_id,
            username: user[i].access_credentials.user_name
        });
    }

    return result;
}

async function getUnit(){
    const unit = await database.units.findMany({
        select: {
            unit_id: true,
            units_name: true
        }
    });

    const result = [];
    for (let i = 0; i < unit.length; i++){
        result.push({
            id: unit[i].unit_id,
            name: unit[i].units_name
        });
    }

    return result;
}

async function updateUnit(query_unit_id, query_unit_name){
    return await database.unit.update({
        where: {
            id: query_unit_id
        },
        data: {
            name: query_unit_name
        }
    });
}

module.exports = {
    createProductSheet,
    getProductSheet,
    updateProductSheet,
    getTaxonomy,
    getSubTaxonomy,
    getUser,
    getUnit
}