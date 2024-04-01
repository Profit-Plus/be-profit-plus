const { database } = require('../../helpers/utils/db/database');

async function getSheet(){
    return database.product.findMany({
        select: {
            id: true,
            name: true,
        },
    });
}

async function getSheetById(id){
    console.log(id + " prisma")
    return database.product.findUnique({
        where: {
            id,
        },
    });
}


async function createSheet(name){
    return database.product.create({
        data: {
            name
        },
    });
}

async function updateSheet(id, name){
    return database.product.update({
        where: { id },
        data: {
            name
        },
    });
}

async function deleteSheet(id){
    return database.product.delete({
        where: { id },
    });
}

module.exports = {
    getSheet,
    getSheetById,
    createSheet,
    updateSheet,
    deleteSheet
}