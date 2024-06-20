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
        solution_id: true,
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
        solution: {
            include: {
                items: {
                    include: {
                        package: true,
                        product: true
                    }
                }
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
        const solution = await transaction.project_solution.create({
            data: { solution_name: payload.solution.solution_name }
        });
        await transaction.project_solution_detail.createMany({
            data: payload.solution.items.map((item) => ({
                ...item,
                project_solution_id: solution.id
            }))
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
                project_close_out_id: closeout.id,
                solution_id: solution.id
            }
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
            include: { customer: true, solution: true },
            omit: { solution_id: true }
        }),
        database.project.count({ where: condition }),
        database.project.count({ where: { ...condition, status: 'initiation' } }),
        database.project.count({ where: { ...condition, status: 'ongoing' } }),
        database.project.count({ where: { ...condition, status: 'drop' } }),
        database.project.count({ where: { ...condition, status: 'close_out' } })
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

async function updateProject({ projectId, projectInitId, projectOngoingId, projectDropId, projectCloseOutId, projectSolutionId, isMember, payload }) {
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
        if (payload.solution) {
            await transaction.project_solution.update({
                data: {
                    solution_name: payload.solution.solution_name
                },
                where: { id: projectSolutionId }
            });
            if (payload.solution && payload.solution.items.length > 0) {
                await transaction.project_solution_detail.deleteMany({
                    where: { project_solution_id: projectSolutionId }
                });
                await transaction.project_solution_detail.createMany({
                    data: payload.solution.items.map((item) => ({
                        ...item,
                        project_solution_id: projectSolutionId
                    }))
                });
            }
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
    return database.project.delete({
        where: {
            id: projectId
        }
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