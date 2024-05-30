const { database } = require('../../helpers/utils/db/database');

function createPIC(payload) {
    return database.pic.create({
        data: payload
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
        },
        created_at: {
            gte: params.start_date ? new Date(params.start_date) : undefined,
            lt: params.end_date ? new Date(new Date(params.end_date).getTime() + 24 * 60 * 60 * 1000) : undefined
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

async function findUniquePhone(picPhone) {
    const isExist = await database.pic.findUnique({
        where: {
            AND: [
                { phone: picPhone },
                { deleted_at: null }
            ]
        }
    });

    if (isExist) return true;
    else return false;
}

function updatePIC(picId, payload) {
    return database.pic.update({
        where: { id: picId },
        data: payload
    });
}

function deletePIC(picId) {
    return database.pic.delete({
        where: { id: picId }
    });
}

module.exports = {
    createPIC,
    findAllPICs,
    findPIC,
    findUniquePhone,
    updatePIC,
    deletePIC
}

