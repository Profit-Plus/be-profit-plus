const { database } = require('../../helpers/utils/db/database');
const { v4: uuidv4 } = require('uuid');

function createProject(data) {
    return database.project.create({
        data: {
            ...data,
            project_init: {
                create: {
                    id: uuidv4(),
                    project_id: data.id
                }
            },
            project_ongoing: {
                create: {
                    id: uuidv4(),
                    project_id: data.id
                }
            },
            project_drop: {
                create: {
                    id: uuidv4(),
                    project_id: data.id
                }
            },
            project_close_out: {
                create: {
                    id: uuidv4(),
                    project_id: data.id
                }
            },
        }
    });
}

function createProjectInit(data) {
    return database.project_init.create({
        data: data
    });
}

function createProjectOngoing(data) {
    return database.project_ongoing.create({
        data: data
    });
}

function createProjectCloseOut(data) {
    return database.project_close_out.create({
        data: data
    });
}

function createProjectDrop(data) {
    return database.project_drop.create({
        data: data
    });
}

async function findAllProjects(params) {
    const condition = {
        OR: [
            { customer: { contains: params.search } },
            { topic: { contains: params.search } }
        ],
        created_at: {
            gte: params.start_date ? new Date(params.start_date) : undefined,
            lt: params.end_date ? new Date(new Date(params.end_date).getTime() + 24 * 60 * 60 * 1000) : undefined
        }
    };

    const [data, total] = await database.$transaction([
        database.project.findMany({
            skip: params.limit * (params.page - 1),
            take: params.limit,
            orderBy: {
                [params.sort]: params.order
            },
            where: condition
        }),
        database.project.count({ where: condition })
    ]);

    return {
        page: params.page,
        limit: params.limit,
        total: total,
        data: data
    };
}

function findProject(projectId) {
    return database.project.findUnique({
        where: { id: projectId }
    });
}

function findProjectInit(projectInitId) {
    return database.project_init.findUnique({
        where: { id: projectInitId }
    });
}

function findProjectOngoing(projectOngoingId) {
    return database.project_ongoing.findUnique({
        where: { id: projectOngoingId }
    });
}

function findProjectCloseOut(projectCloseOutId) {
    return database.project_close_out.findUnique({
        where: { id: projectCloseOutId }
    });
}

function findProjectDrop(projectDropId) {
    return database.project_drop.findUnique({
        where: { id: projectDropId }
    });
}

function updateProject(projectId, data) {
    return database.project.update({
        where: {
            id: projectId
        },
        data: data
    });
}

function updateProjectInit(projectInitId, data) {
    return database.project_init.update({
        where: {
            id: projectInitId
        },
        data: data
    });
}

function updateProjectOngoing(projectOngoingId, data) {
    return database.project_ongoing.update({
        where: {
            id: projectOngoingId
        },
        data: data
    });
}

function updateProjectCloseOut(projectCloseOutId, data) {
    return database.project_close_out.update({
        where: {
            id: projectCloseOutId
        },
        data: data
    });
}

function updateProjectDrop(projectDropId, data) {
    return database.project_close_out.update({
        where: {
            id: projectDropId
        },
        data: data
    });
}


function deleteProject(projectId) {
    return database.project.delete({
        where: {
            id: projectId
        }
    });
}

function doTransaction(transactions) {  
    return database.$transaction(transactions);
}

module.exports = {
    createProject,
    createProjectInit,
    createProjectOngoing,
    createProjectCloseOut,
    createProjectDrop,
    findAllProjects,
    findProject,
    findProjectInit,
    findProjectOngoing,
    findProjectCloseOut,
    findProjectDrop,
    updateProject,
    updateProjectInit,
    updateProjectOngoing,
    updateProjectCloseOut,
    updateProjectDrop,
    deleteProject,
    doTransaction
};