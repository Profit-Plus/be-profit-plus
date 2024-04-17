const { database } = require('../../helpers/utils/db/database');

async function getProducts() {
    return database.product.findMany();
}

async function getTotalProduct() {
    return database.product.count();
}

async function lastProduct() {
    return database.product.findFirst({
        include: {
            type: {
                include:{
                    category: true,
                }
            }
        },
        orderBy: {
            id: 'desc',
        },
    });
}

async function getTotalTypeByProductId(productId) {
    return database.type.count({
        where: {
            productId,
        },
    });
}

async function getTotalCategoryByProductId(productId) {
    return database.category.count({
        where: {
            productId,
        },
    });
}

async function getTotalProductLastMonth() {
    const oneMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1));
    return database.product.count({
        where: {
            createdAt: {
                gte: oneMonthAgo,
            },
        },
    });
}

module.exports = {
    getProducts,
    getTotalProduct,
    lastProduct,
    getTotalTypeByProductId,
    getTotalCategoryByProductId,
    getTotalProductLastMonth,
};