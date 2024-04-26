const { database } = require('../../helpers/utils/db/database');

function createPIC(data) {
    return database.pic.create({
        data: data
    });
}

async function findAllPICs(params) {
    const condition = {
        OR: [
            { name: { contains: params.search } },
            { phone: { contains: params.search } },
        ],
        role: {
            equals: params.role
        }
    };    

    const [data, total] = await database.$transaction([
        database.pic.findMany({
            skip: params.limit * (params.page - 1),
            take: params.limit,
            orderBy: {
                [params.sort]: params.order
            },
            where: condition
        }),
        database.pic.count({ where: condition })
    ]);

    return {
        page: params.page,
        limit: params.limit,
        total: total,
        data: data
    };
}

function findPIC(picId) {
    return database.pic.findUnique({
        where: { id: picId }
    });
}

function updatePIC(picId, data) {
    return database.pic.update({
        where: {
            id: picId
        },
        data: data
    });
}

function deletePIC(picId) {
    return database.pic.delete({
        where: {
            id: picId
        }
    });
}

module.exports = {
    createPIC,
    findAllPICs,
    findPIC,
    updatePIC,
    deletePIC
};
