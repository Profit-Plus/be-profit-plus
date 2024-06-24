const { PrismaClient, UnitTargetEnum } = require('@prisma/client');
const prisma = new PrismaClient();

async function getCalculation(sheetId) {
    const packages = await prisma.packages.findMany({
        where: { sheet_id: sheetId },
        include: {
            totals: {
                select: {
                    type: true,
                    type_id: true,
                    total: true,
                },
            },
        },
    });

    return packages.map(pkg => ({
        id: pkg.id,
        sheet_id: pkg.sheet_id,
        name: pkg.name,
        category: pkg.category,
        target_sales: pkg.target_sales,
        unit_target: pkg.unit_target,
        business_model: pkg.business_model,
        payback_period: pkg.payback_period,
        operational_time: pkg.operational_time,
        excess_capacity: pkg.excess_capacity,
        total: pkg.totals.map(total => ({
            type: total.type.type,
            type_id: total.type_id,
            total: total.total,
        })),
    }));
}

async function getCalculationById(packageId) {
    const packageData = await prisma.packages.findUnique({
        where: { id: Number(packageId) },
        include: {
            sheet: true,
            totals: {
                select: {
                    type: true,
                    type_id: true,
                    total: true,
                },
            },
        },
    });

    if (!packageData) {
        throw new Error('Package not found');
    }

    return {
        id: packageData.id,
        sheet_id: packageData.sheet_id,
        sheet_name: packageData.sheet.name,
        name: packageData.name,
        category: packageData.category,
        target_sales: packageData.target_sales,
        unit_target: packageData.unit_target,
        business_model: packageData.business_model,
        payback_period: packageData.payback_period,
        operational_time: packageData.operational_time,
        excess_capacity: packageData.excess_capacity,
        total: packageData.totals.map(total => ({
            type: total.type.type,
            type_id: total.type_id,
            total: total.total,
        })),
    };
}

async function putCalculation(packageId, updateData) {
    const updatedPackage = await prisma.packages.update({
        where: { id: Number(packageId) },
        data: updateData,
        include: {
            totals: {
                select: {
                    type: true,
                    type_id: true,
                    total: true,
                },
            },
        },
    });

    return {
        id: updatedPackage.id,
        sheet_id: updatedPackage.sheet_id,
        name: updatedPackage.name,
        category: updatedPackage.category,
        target_sales: updatedPackage.target_sales,
        unit_target: updatedPackage.unit_target,
        business_model: updatedPackage.business_model,
        payback_period: updatedPackage.payback_period,
        operational_time: updatedPackage.operational_time,
        excess_capacity: updatedPackage.excess_capacity,
        total: updatedPackage.totals ? updatedPackage.totals.map(total => ({
            type: total.type.type,
            type_id: total.type_id,
            total: total.total,
        })) : [],
    };
}

module.exports = {
    getCalculation,
    getCalculationById,
    putCalculation,
};

// const prisma = new PrismaClient();

// async function getCalculation(sheetId) {
//     const packages = await prisma.package.findMany({
//         where: { sheetId: sheetId },
//         include: {
//             totals: {
//                 select: {
//                     type: true,
//                     typeId: true,
//                     total: true,
//                 },
//             },
//         },
//     });

//     return packages.map(pkg => ({
//         id: pkg.id,
//         sheetId: pkg.sheetId,
//         name: pkg.name,
//         category: pkg.category,
//         targetSales: pkg.targetSales,
//         unitTarget: pkg.unitTarget,
//         businessModel: pkg.businessModel,
//         paybackPeriod: pkg.paybackPeriod,
//         operationalTime: pkg.operationalTime,
//         excessCapacity: pkg.excessCapacity,
//         total: pkg.totals.map(total => ({
//             type: total.type.type,
//             typeId: total.typeId,
//             total: total.total,
//         })),
//     }));
// }

// async function getCalculationById(packageId) {
//     const packageData = await prisma.package.findUnique({
//         where: { id: Number(packageId) },
//         include: {
//             sheet: true,
//             totals: {
//                 select: {
//                     type: true,
//                     typeId: true,
//                     total: true,
//                 },
//             },
//         },
//     });

//     if (!packageData) {
//         throw new Error('Package not found');
//     }

//     return {
//         id: packageData.id,
//         sheetId: packageData.sheetId,
//         sheetName: packageData.sheet.name,
//         name: packageData.name,
//         category: packageData.category,
//         targetSales: packageData.targetSales,
//         unitTarget: packageData.unitTarget,
//         businessModel: packageData.businessModel,
//         paybackPeriod: packageData.paybackPeriod,
//         operationalTime: packageData.operationalTime,
//         excessCapacity: packageData.excessCapacity,
//         total: packageData.totals.map(total => ({
//             type: total.type.type,
//             typeId: total.typeId,
//             total: total.total,
//         })),
//     };
// }

// async function putCalculation(packageId, updateData) {
//     const updatedPackage = await prisma.package.update({
//         where: { id: Number(packageId) },
//         data: updateData,
//         include: {
//             totals: {
//                 select: {
//                     type: true,
//                     typeId: true,
//                     total: true,
//                 },
//             },
//         },
//     });

//     return {
//         id: updatedPackage.id,
//         sheetId: updatedPackage.sheetId,
//         name: updatedPackage.name,
//         category: updatedPackage.category,
//         targetSales: updatedPackage.targetSales,
//         unitTarget: updatedPackage.unitTarget,
//         businessModel: updatedPackage.businessModel,
//         paybackPeriod: updatedPackage.paybackPeriod,
//         operationalTime: updatedPackage.operationalTime,
//         excessCapacity: updatedPackage.excessCapacity,
//         total: updatedPackage.totals ? updatedPackage.totals.map(total => ({
//             type: total.type.type,
//             typeId: total.typeId,
//             total: total.total,
//         })) : [],
//     };
// }

// module.exports = {
//     getCalculation,
//     getCalculationById,
//     putCalculation,
// };