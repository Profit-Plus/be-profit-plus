const { database } = require('../../helpers/utils/db/database');

function createCustomer(data) {
    return database.customer.create({
        data: data
    });
}

async function findAllCustomers(params) {
    const condition = {
        name: { contains: params.search }
    };

    const [data, total] = await database.$transaction([
        database.customer.findMany({
            skip: params.limit * (params.page - 1),
            take: params.limit,
            orderBy: {
                [params.sort]: params.order
            },
            where: condition
        }),
        database.customer.count({ where: condition })
    ]);

    return {
        page: params.page,
        limit: params.limit,
        total: total,
        data: data
    }
}

function findCustomer(customerId) {
    return database.customer.findUnique({
        where: { id: customerId }
    });
}

function updateCustomer(customerId, data) {
    return database.customer.update({
        where: {
            id: customerId
        },
        data: data
    });
}

function deleteCustomer(customerId) {
    return database.customer.delete({
        where: {
            id: customerId
        }
    });
}

module.exports = {
    createCustomer,
    findAllCustomers,
    findCustomer,
    updateCustomer,
    deleteCustomer
};