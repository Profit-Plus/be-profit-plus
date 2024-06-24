// services/tariffServices/componentServices.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllComponents() {
    return await prisma.component.findMany();
}

async function deleteComponentById(id) {
    await prisma.component.delete({
        where: { id: id },
    });
}

async function createComponent(newComponentData) {
    return await prisma.component.create({
        data: newComponentData,
    });
}

async function updateComponentById(id, updateData) {
    return await prisma.component.update({
        where: { id: id },
        data: updateData,
    });
}

module.exports = {
    getAllComponents,
    deleteComponentById,
    createComponent,
    updateComponentById,
};
