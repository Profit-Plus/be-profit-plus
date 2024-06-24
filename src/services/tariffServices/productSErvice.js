
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
    const product = await database.product_sheet.findUnique({
        select:{
            id:true,
            nomor:true,
            limitation:true,
            recommendation:true,
            taxonomy: {
                select: {
                    id: true,
                    name: true
                }
            },
            sub_taxonomy:{
                select:{
                    id:true,
                    name:true
                }
            },
            product:{
                select:{
                    id:true,
                    name:true
                } 
            },
            owner:{
                select:{
                    id:true,
                    name:true
                }
            },
            owner_status:true,
            requester:{
                select:{
                    id:true,
                    name:true
                }
            },
            requester_status:true,
            reviewer:{
                select:{
                    id:true,
                    username:true
                }
            },
            reviewer_status:true,
            drafer:{
                select:{
                    id:true,
                    username:true
                }
            },
            drafter_status:true,
            approver:{
                select:{
                    id:true,
                   username:true
                }
            },
            approver_status:true,


        },
        where: {
            sheet_id: query_sheet_id
        }
    });


    return product;
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
                    id: req.owner_id
                }
            },
            owner_status: req.owner_status,
            requester: {
                connect: {
                    id: req.requester_id
                }
            },
            requester_status: req.requester_status,
            reviewer: {
                connect: {
                    id: req.reviewer_id
                }
            },
            reviewer_status: req.reviewer_status,
            drafer: {
                connect: {
                    id: req.drafter_id,
                }
            },
            drafter_status: req.drafter_status,
            approver: {
                connect: {
                    id: req.approver_id
                }
            },
            approver_status: req.approver_status
        }
    });
}

async function getTaxonomy(){
    return await database.taxonomy.findMany({
        select: {
            id: true,
            name: true
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
    return await database.user.findMany({
        select: {
            id: true,
            username: true
        },
    });
}

async function getUnit(){
    return await database.unit.findMany({
        select: {
            id: true,
            name: true
        }
    });
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