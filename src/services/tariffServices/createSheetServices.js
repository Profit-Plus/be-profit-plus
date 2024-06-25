// services/createSheetServices.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getNextNomor() {
    const maxNomor = await prisma.product_sheet.aggregate({
        _max: {
            nomor: true
        }
    });

    return maxNomor._max.nomor + 1 || 1;
}

async function createSheet(data) {
    return await prisma.$transaction(async (prisma) => {
        // Create new taxonomy
        const newTaxonomy = await prisma.taxonomy.create({
            data: {
                name: data.taxonomyName
            }
        });

        // Create new sheet with the created taxonomy
        const newSheet = await prisma.sheet.create({
            data: {
                name: data.name,
                product_sheet: {
                    create: {
                        taxonomy: {
                            connect: { id: newTaxonomy.id }
                        }
                    }
                }
            }
        });

        // Create types for the new sheet
        const types = ['CAPEX', 'OPEX', 'COGS'];
        const typePromises = types.map(typeEnum => {
            return prisma.type.create({
                data: {
                    type: typeEnum,
                    sheet: {
                        connect: { id: newSheet.id }
                    }
                }
            });
        });

        await Promise.all(typePromises);

        return newSheet;
    });
}

// async function getAllSheets() {
//     const sheets = await prisma.sheet.findMany({
//         include: {
//             product_sheet: true
//         }
//     });

//     const sheetIds = sheets.map(sheet => sheet.id);

//     const types = await prisma.type.findMany({
//         where: {
//             sheet_id: {
//                 in: sheetIds
//             }
//         }
//     });

//     // Menggabungkan tipe dengan sheets
//     const sheetsWithTypes = sheets.map(sheet => {
//         return {
//             ...sheet,
//             types: types.filter(type => type.sheet_id === sheet.id)
//         };
//     });

//     return sheetsWithTypes;
// }

async function getAllSheets() {
    const sheets = await prisma.sheet.findMany({
        include: {
            product_sheet: true,
        }
    });
    return sheets;
}

module.exports = {
    createSheet,
    getAllSheets
};