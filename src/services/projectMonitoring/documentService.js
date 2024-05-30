const { database } = require('../../helpers/utils/db/database');

function createDocument(payload) {
    return database.document.create({
        data: payload
    });
}

async function findAllDocuments(params) {
    console.log(params);
    const condition = {
        document_name: { contains: params.search },
        created_at: {
            gte: params.start_date ? new Date(params.start_date) : undefined,
            lt: params.end_date ? new Date(new Date(params.end_date).getTime() + 24 * 60 * 60 * 1000) : undefined
        }
    };

    const [data, total] = await database.$transaction([
        database.document.findMany({
            skip: params.limit * (params.page - 1),
            take: params.limit,
            orderBy: {
                [params.sort]: params.order
            },            
            where: condition
        }),
        database.document.count({ where: condition })
    ]);

    return {
        page: params.page,
        limit: params.limit,
        total: total,
        data: data
    };
}

function findDocument(documentId) {
    return database.document.findUnique({        
        where: { id: documentId }
    });
}

function updateDocument(documentId, payload) {
    return database.document.update({
        where: {
            id: documentId
        },
        data: payload
    });
}

function deleteDocument(documentId) {
    return database.document.delete({
        where: {
            id: documentId
        }
    });
}

module.exports = {
    createDocument,
    findAllDocuments,
    findDocument,
    updateDocument,
    deleteDocument
}