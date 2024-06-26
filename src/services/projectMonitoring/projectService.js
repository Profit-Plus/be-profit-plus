const { database } = require('../../helpers/utils/db/database');

const omitIncludeOptions = {
    omit: {
        customer_id: true,
        project_init_id: true,
        project_ongoing_id: true,
        project_drop_id: true,
        project_close_out_id: true,
        creator_id: true,
        updater_id: true,
        pic_external_id: true,
        pic_lira_id: true
    },
    include: {
        customer: true,
        members: {
            omit: { password: true }
        },
        project_init: {
            omit: {
                lir_requirement_id: true,
                mom_req_id: true,
                nde_determination_id: true,
                nde_request_id: true,
                sph_id: true,
                spk_id: true
            },
            include: {
                pic_midfielder: true,
                lir_requirement: true,
                mom_req: true,
                nde_determination: true,
                nde_request: true,
                sph: true,
                spk: true
            }
        },
        project_ongoing: {
            omit: {
                baa_id: true,
                bast_id: true,
                kfs_id: true,
                mom_readiness_id: true,
                nde_confirmation_id: true,
                nde_req_cfu_to_mid_id: true,
                nde_req_mid_to_tcuc_id: true
            },
            include: {
                baa: true,
                bast: true,
                kfs: true,
                mom_readiness: true,
                nde_confirmation: true,
                nde_req_cfu_to_mid: true,
                nde_req_mid_to_tcuc: true
            }
        },
        project_drop: {
            omit: {
                nde_project_drop_id: true
            },
            include: {
                nde_project_drop: true
            }
        },
        project_close_out: {
            omit: {
                mom_reconciles_id: true,
                nde_report_project_id: true,
                nde_revenue_recognition_id: true,
                nps_id: true,
                report_project_id: true
            },
            include: {
                mom_reconciles: true,
                nde_report_project: true,
                nde_revenue_recognition: true,
                nps: true,
                report_project: true
            }
        },
        created_by: {
            omit: { password: true }
        },
        updated_by: {
            omit: { password: true }
        },
        selected_product: {
            include: {
                product: true,
                offering: true
            },
            omit: {
                product_id: true,
                offering_id: true
            }
        },
        pic_external: true,
        pic_lira: true
    }
}

async function createProject(payload) {
    const result = await database.$transaction(async (transaction) => {
        const init = await transaction.project_init.create({
            data: { project_id: payload.project.id }
        });
        const ongoing = await transaction.project_ongoing.create({
            data: { project_id: payload.project.id }
        });
        const drop = await transaction.project_drop.create({
            data: { project_id: payload.project.id }
        });
        const closeout = await transaction.project_close_out.create({
            data: { project_id: payload.project.id }
        });
        const project = await transaction.project.create({
            data: {
                ...payload.project,
                members: {
                    connect: { access_credentials_id: payload.project.creator_id }
                },
                project_init_id: init.id,
                project_ongoing_id: ongoing.id,
                project_drop_id: drop.id,
                project_close_out_id: closeout.id
            }
        });
        await transaction.selected_product.createMany({
            data: payload.selected_product.map((item) => ({
                ...item,
                project_id: project.id
            }))
        });

        return project;
    });

    return result;
}

async function findAllProjects(params) {
    const condition = {
        topic: { contains: params.search },
        requesting_approval: params.requesting_approval,
        status: params.status,
        created_at: {
            gte: params.start_date ? new Date(params.start_date) : undefined,
            lt: params.end_date ? new Date(new Date(params.end_date).getTime() + 24 * 60 * 60 * 1000) : undefined
        }
    };

    const [data, total, totalInit, totalOngoing, totalDrop, totalCloseOut] = await database.$transaction([
        database.project.findMany({
            skip: params.limit * (params.page - 1),
            take: params.limit,
            orderBy: {
                [params.sort]: params.order
            },
            where: condition,
            include: { customer: true, selected_product: true },
            omit: { customer_id: true }
        }),
        database.project.count({
            where: {
                topic: { contains: params.search },
                requesting_approval: params.requesting_approval,                
                created_at: {
                    gte: params.start_date ? new Date(params.start_date) : undefined,
                    lt: params.end_date ? new Date(new Date(params.end_date).getTime() + 24 * 60 * 60 * 1000) : undefined
                },
                deleted_at: null
            }
        }),
        database.project.count({ where: { ...condition, deleted_at: null, status: 'initiation' } }),
        database.project.count({ where: { ...condition, deleted_at: null, status: 'ongoing' } }),
        database.project.count({ where: { ...condition, deleted_at: null, status: 'drop' } }),
        database.project.count({ where: { ...condition, deleted_at: null, status: 'close_out' } })
    ]);

    return {
        page: params.page,
        limit: params.limit,
        total_page: Math.ceil(total / params.limit),
        total: total,
        total_init: totalInit,
        total_ongoing: totalOngoing,
        total_drop: totalDrop,
        total_close_out: totalCloseOut,
        data: data
    };
}

function findProject(projectId) {
    return database.project.findUnique({
        where: { id: projectId },
        ...omitIncludeOptions
    });
}

async function updateProject({ projectId, projectInitId, projectOngoingId, projectDropId, projectCloseOutId, isMember, payload }) {
    const result = await database.$transaction(async (transaction) => {
        if (payload.project_init) {
            await transaction.project_init.update({
                data: payload.project_init,
                where: { id: projectInitId }
            });
        }
        if (payload.project_ongoing) {
            await transaction.project_ongoing.update({
                data: payload.project_ongoing,
                where: { id: projectOngoingId }
            });
        }
        if (payload.project_drop) {
            await transaction.project_drop.update({
                data: payload.project_drop,
                where: { id: projectDropId }
            });
        }
        if (payload.project_close_out) {
            await transaction.project_close_out.update({
                data: payload.project_close_out,
                where: { id: projectCloseOutId }
            });
        }
        if (payload.selected_product && payload.selected_product.length > 0) {
            await transaction.selected_product.deleteMany({
                where: { project_id: projectId }
            });
            await transaction.selected_product.createMany({
                data: payload.selected_product.map((item) => ({
                    ...item,
                    project_id: project.id
                }))
            });
        }
        const project = await transaction.project.update({
            data: {
                ...payload.project,
                members: {
                    connect: isMember ? [] : { access_credentials_id: payload.project.updater_id }
                }
            },
            where: { id: projectId },
            ...omitIncludeOptions
        });

        return project;
    });

    return result;
}

function deleteProject(projectId) {
    return database.$transaction(async (transaction) => {
        const project = await database.project.delete({ where: { id: projectId } })
        await transaction.project_init.delete({ where: { id: project.project_init_id } })
        await transaction.project_ongoing.delete({ where: { id: project.project_ongoing_id } })
        await transaction.project_close_out.delete({ where: { id: project.project_close_out_id } })
        await transaction.project_drop.delete({ where: { id: project.project_drop_id } })
        await transaction.selected_product.deleteMany({ where: { project_id: projectId } })
        await transaction.comment.deleteMany({ where: { project_id: projectId } })
        await transaction.notification.deleteMany({ where: { url: { contains: projectId } } })
    });
}

async function updateProjectApprovalStatus({ projectId, model, identifier, projectStatus, approvalStatus, isMember, updaterId }) {
    const result = await database.$transaction(async (transaction) => {
        await transaction[model].update({
            data: { approval_status: approvalStatus },
            where: { id: identifier }
        });
        const project = await transaction.project.update({
            data: {
                requesting_approval: approvalStatus == 'requesting',
                status: projectStatus,
                updater_id: updaterId,
                members: {
                    connect: isMember ? [] : { access_credentials_id: updaterId }
                },
            },
            where: { id: projectId },
            ...omitIncludeOptions
        });

        return project;
    });

    return result;
}

module.exports = {
    createProject,
    findAllProjects,
    findProject,
    updateProject,
    updateProjectApprovalStatus,
    deleteProject,
}