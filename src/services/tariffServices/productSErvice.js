const { database } = require('../../helpers/utils/db/database');

async function createProductSheet(query_sheet_id, query_product_name) {
    return await database.product_sheet.create({
        data: {
            product_name: query_product_name,
            sheet_id: query_sheet_id
        }
    });
};

async function getProductSheet(query_sheet_id) {
    const product = await database.product_sheet.findUnique({
        select:{
            id:true,
            nomor:true,
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
            pic_tarif:{
                select:{
                    user_id:true,
                    product_sheet_id:true,
                    status:true,
                    isChecked:true,
                    user:{
                        select:{
                            id:true,
                            username:true,
                            role:true
                        }
                    }
                },
            }
        },
        where: {
            sheet_id: query_sheet_id
        }
    });
    return product;
}

async function updateProductSheet(query_sheet_id, query_product_name) {
    return await database.product_sheet.update({
        where: {
            sheet_id: query_sheet_id
        },
        data: {
            product_name: query_product_name
        }
    });
}

module.exports = {
    createProductSheet,
    getProductSheet,
    updateProductSheet
}