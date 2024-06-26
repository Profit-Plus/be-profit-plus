// services/tariffServices/componentServices.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllComponents() {
    return await prisma.component.findMany();
}

async function deleteComponentById(id) {
    // Delete relationships between data and component
    await prisma.data_component.deleteMany({
        where: { component_id: id },
    });

    // Delete the component itself
    return await prisma.component.delete({
        where: { id: id },
    });
}

async function createComponent(newComponentData) {
    return await prisma.component.create({
        data: {
            name: newComponentData.name,
            code: newComponentData.code,
            item: newComponentData.item,
            unit: newComponentData.unit,
            specs: newComponentData.specs,
            price_per_unit: newComponentData.price_per_unit,
            quantity: newComponentData.quantity,
            note: newComponentData.note,
        },
    });
}

async function updateComponentById(id, updateData) {
    return await prisma.component.update({
        where: { id: id },
        data: {
            name: updateData.name,
            code: updateData.code,
            item: updateData.item,
            unit: updateData.unit,
            specs: updateData.specs,
            price_per_unit: updateData.price_per_unit,
            quantity: updateData.quantity,
            note: updateData.note,
        },
    });
}

module.exports = {
    getAllComponents,
    deleteComponentById,
    createComponent,
    updateComponentById,
};

// // services/tariffServices/componentServices.js
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// async function getAllComponents() {
//     return await prisma.component.findMany();
// }

// async function deleteComponentById(id) {
//     await prisma.component.delete({
//         where: { id: id },
//     });
// }

// async function createComponent(newComponentData) {
//     return await prisma.component.create({
//         data: newComponentData,
//     });
// }

// async function updateComponentById(id, updateData) {
//     return await prisma.component.update({
//         where: { id: id },
//         data: updateData,
//     });
// }

// module.exports = {
//     getAllComponents,
//     deleteComponentById,
//     createComponent,
//     updateComponentById,
// };
