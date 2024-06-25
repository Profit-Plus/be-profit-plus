// services/createSheetServices.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createSheet(data) {
    const newSheet = await prisma.sheet.create({
        data: {
            name: data.name,
            product_sheet: {
                create: {
                    nomor: Date.now(),
                    taxonomy: {
                        connect: { id: data.taxonomy }
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
}

module.exports = {
    createSheet
};