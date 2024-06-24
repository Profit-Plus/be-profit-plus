// File path: /services/masterServices.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllData() {
    const data = await prisma.data.findMany({
        include: {
            components: {
                include: {
                    component: true
                }
            }
        }
    });

    const results = data.map(d => ({
        id: d.id,
        code: d.code,
        event_module: d.event_module,
        unit: d.unit,
        grade: d.grade,
        components: d.components.map(c => ({
            data_id: c.data_id,
            id: c.component.id,
            name: c.component.name,
            item: c.component.item,
            specs: c.component.specs,
            unit: c.component.unit,
            price_per_unit: c.component.price_per_unit,
            quantity: c.component.quantity,
            note: c.component.note || '-'
        }))
    }));

    return results;
}

async function getDataById(data_id) {
    const data = await prisma.data.findUnique({
        where: { id: data_id },
        include: {
            components: {
                include: {
                    component: true
                }
            }
        }
    });

    if (!data) {
        return null;
    }

    const result = {
        id: data.id,
        code: data.code,
        event_module: data.event_module,
        unit: data.unit,
        grade: data.grade,
        components: data.components.map(c => ({
            data_id: c.data_id,
            id: c.component.id,
            name: c.component.name,
            item: c.component.item,
            specs: c.component.specs,
            unit: c.component.unit,
            price_per_unit: c.component.price_per_unit,
            quantity: c.component.quantity,
            note: c.component.note || '-'
        }))
    };

    return result;
}

async function createData(data) {
    const newData = await prisma.data.create({
        data: data
    });

    return newData;
}

async function updateDataById(data_id, updatedData) {
    const data = await prisma.data.update({
        where: { id: data_id },
        data: updatedData
    });

    return data;
}

async function deleteDataById(data_id) {
    // Hapus hubungan antara data dan component
    await prisma.data_component.deleteMany({
        where: { data_id: data_id }
    });

    // Hapus data dari tabel data
    const data = await prisma.data.delete({
        where: { id: data_id }
    });

    return data;
}

async function deleteComponentById(component_id) {
    // Hapus hubungan antara data dan component
    const componentRelation = await prisma.data_component.deleteMany({
        where: { component_id: component_id }
    });

    return componentRelation;
}

async function addRelation(data_id, component_id) {
    try {
        // Check if data_id exists
        const dataExists = await prisma.data.findUnique({
            where: { id: parseInt(data_id) }
        });

        if (!dataExists) {
            throw new Error(`Data with id ${data_id} does not exist`);
        }

        // Check if component_id exists
        const componentExists = await prisma.component.findUnique({
            where: { id: parseInt(component_id) }
        });

        if (!componentExists) {
            throw new Error(`Component with id ${component_id} does not exist`);
        }

        // Create the relation
        const newRelation = await prisma.data_component.create({
            data: {
                data_id: parseInt(data_id),
                component_id: parseInt(component_id)
            }
        });

        return newRelation;
    } catch (error) {
        console.error('Error adding relation:', error.message);
        throw error;
    }
}

module.exports = {
    getAllData,
    getDataById,
    createData,
    updateDataById,
    deleteDataById,
    deleteComponentById,
    addRelation
};



// // File path: /services/masterServices.js

// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// async function getAllData() {
//     const data = await prisma.data.findMany({
//         include: {
//             components: {
//                 include: {
//                     component: true
//                 }
//             }
//         }
//     });

//     const results = data.map(d => ({
//         id: d.id,
//         code: d.code,
//         eventModule: d.eventModule,
//         unit: d.unit,
//         grade: d.grade,
//         components: d.components.map(c => ({
//             data_id: c.data_id,
//             id: c.component.id,
//             name: c.component.name,
//             item: c.component.item,
//             specs: c.component.specs,
//             unit: c.component.unit,
//             pricePerUnit: c.component.pricePerUnit,
//             quantity: c.component.quantity,
//             note: c.component.note || '-'
//         }))
//     }));

//     return results;
// }

// async function getDataById(data_id) {
//     const data = await prisma.data.findUnique({
//         where: { id: data_id },
//         include: {
//             components: {
//                 include: {
//                     component: true
//                 }
//             }
//         }
//     });

//     if (!data) {
//         return null;
//     }

//     const result = {
//         id: data.id,
//         code: data.code,
//         eventModule: data.eventModule,
//         unit: data.unit,
//         grade: data.grade,
//         components: data.components.map(c => ({
//             data_id: c.data_id,
//             id: c.component.id,
//             name: c.component.name,
//             item: c.component.item,
//             specs: c.component.specs,
//             unit: c.component.unit,
//             pricePerUnit: c.component.pricePerUnit,
//             quantity: c.component.quantity,
//             note: c.component.note || '-'
//         }))
//     };

//     return result;
// }

// async function createDataById(data) {
//     const newData = await prisma.data.create({
//         data: data
//     });

//     return newData;
// }

// async function updateDataById(data_id, updatedData) {
//     const data = await prisma.data.update({
//         where: { id: data_id },
//         data: updatedData
//     });

//     return data;
// }

// async function deleteDataById(data_id) {
//     // Hapus hubungan antara data dan component
//     await prisma.data_component.deleteMany({
//         where: { data_id: data_id }
//     });

//     // Hapus data dari tabel data
//     const data = await prisma.data.delete({
//         where: { id: data_id }
//     });

//     return data;
// }

// async function deleteComponentById(component_id) {
//     // Hapus hubungan antara data dan component
//     const componentRelation = await prisma.data_component.deleteMany({
//         where: { component_id: component_id }
//     });

//     return componentRelation;
// }

// module.exports = {
//     getAllData,
//     getDataById,
//     createDataById,
//     updateDataById,
//     deleteDataById,
//     deleteComponentById
// };
