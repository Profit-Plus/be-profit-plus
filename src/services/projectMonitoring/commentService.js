const { database } = require('../../helpers/utils/db/database');

function createComment(payload) {
    return database.comment.create({
        data: payload,
    });
}

async function findAllComments(params) {
    const condition = {
        comment: { contains: params.search },
        project_id: params.project_id,
        comment_type: params.comment_type,
        created_at: {
            gte: params.start_date ? new Date(params.start_date) : undefined,
            lt: params.end_date ? new Date(new Date(params.end_date).getTime() + 24 * 60 * 60 * 1000) : undefined
        }
    };

    const [data, total] = await database.$transaction([
        database.comment.findMany({
            skip: params.limit * (params.page - 1),
            take: params.limit,
            orderBy: {
                [params.sort]: params.order
            },
            where: condition
        }),
        database.comment.count({ where: condition })
    ]);

    return {
        page: params.page,
        limit: params.limit,
        total: total,
        data: data
    };
}

function findComment(commentId) {
    return database.comment.findUnique({
        where: { id: commentId }
    });
}

function updateComment(commentId, payload) {
    return database.comment.update({
        where: {
            id: commentId
        },
        data: payload
    });
}

function deleteComment(commentId) {
    return database.comment.delete({
        where: {
            id: commentId
        }
    });
}

module.exports = {
    createComment,
    findAllComments,
    findComment,    
    updateComment,
    deleteComment
}