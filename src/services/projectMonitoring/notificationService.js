const { database } = require('../../helpers/utils/db/database');

const omitIncludeOptions = {
    include: {
        sender: {
            omit: { password: true }
        }
    },
    omit: { receiver_id: true, sender_id: true }
}

function createNotification(payload) {
    return database.notification.create({
        data: payload,
        ...omitIncludeOptions
    });
}

async function findAllNotifications(params) {
    const condition = {
        OR: [
            { header: { contains: params.search } },
            { content: { contains: params.search } },
        ],
        created_at: {
            gte: params.start_date ? new Date(params.start_date) : undefined,
            lt: params.end_date ? new Date(new Date(params.end_date).getTime() + 24 * 60 * 60 * 1000) : undefined
        },
        receiver_id: params.receiver_id
    };

    const [data, total] = await database.$transaction([
        database.notification.findMany({
            skip: params.limit * (params.page - 1),
            take: params.limit,
            orderBy: {
                [params.sort]: params.order
            },            
            where: condition,
            ...omitIncludeOptions
        }),
        database.notification.count({ where: condition })
    ]);

    return {
        page: params.page,
        limit: params.limit,
        total: total,
        data: data
    };
}

function findNotification(notificationId) {
    return database.notification.findUnique({
        where: { id: notificationId },
        ...omitIncludeOptions
    });
}

function deleteNotification(notificationId) {
    return database.notification.delete({
        where: {
            id: notificationId
        }
    });
}

module.exports = {
    createNotification,
    findAllNotifications,
    findNotification,
    deleteNotification
}