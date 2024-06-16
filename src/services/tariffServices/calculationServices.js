const { PrismaClient, UnitTargetEnum } = require('@prisma/client');
const prisma = new PrismaClient();

async function getCalculation(sheetId) {
    const packages = await prisma.package.findMany({
        where: { sheetId: sheetId },
        include: {
            totals: {
                select: {
                    type: true,
                    typeId: true,
                    total: true,
                },
            },
        },
    });

    return packages.map(pkg => ({
        id: pkg.id,
        sheetId: pkg.sheetId,
        name: pkg.name,
        category: pkg.category,
        targetSales: pkg.targetSales,
        unitTarget: pkg.unitTarget,
        businessModel: pkg.businessModel,
        paybackPeriod: pkg.paybackPeriod,
        operationalTime: pkg.operationalTime,
        excessCapacity: pkg.excessCapacity,
        total: pkg.totals.map(total => ({
            type: total.type.type,
            typeId: total.typeId,
            total: total.total,
        })),
    }));
}

async function getCalculationById(packageId) {
    const packageData = await prisma.package.findUnique({
        where: { id: Number(packageId) },
        include: {
            sheet: true,
            totals: {
                select: {
                    type: true,
                    typeId: true,
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
        sheetId: packageData.sheetId,
        sheetName: packageData.sheet.name,
        name: packageData.name,
        category: packageData.category,
        targetSales: packageData.targetSales,
        unitTarget: packageData.unitTarget,
        businessModel: packageData.businessModel,
        paybackPeriod: packageData.paybackPeriod,
        operationalTime: packageData.operationalTime,
        excessCapacity: packageData.excessCapacity,
        total: packageData.totals.map(total => ({
            type: total.type.type,
            typeId: total.typeId,
            total: total.total,
        })),
    };
}

async function putCalculation(packageId, updateData) {
    const updatedPackage = await prisma.package.update({
        where: { id: Number(packageId) },
        data: updateData,
        include: {
            totals: {
                select: {
                    type: true,
                    typeId: true,
                    total: true,
                },
            },
        },
    });

    return {
        id: updatedPackage.id,
        sheetId: updatedPackage.sheetId,
        name: updatedPackage.name,
        category: updatedPackage.category,
        targetSales: updatedPackage.targetSales,
        unitTarget: updatedPackage.unitTarget,
        businessModel: updatedPackage.businessModel,
        paybackPeriod: updatedPackage.paybackPeriod,
        operationalTime: updatedPackage.operationalTime,
        excessCapacity: updatedPackage.excessCapacity,
        total: updatedPackage.totals ? updatedPackage.totals.map(total => ({
            type: total.type.type,
            typeId: total.typeId,
            total: total.total,
        })) : [],
    };
}

module.exports = {
    getCalculation,
    getCalculationById,
    putCalculation,
};