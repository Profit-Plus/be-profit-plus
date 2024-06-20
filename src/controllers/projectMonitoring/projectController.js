const projectService = require('../../services/projectMonitoring/projectService');
const commentService = require('../../services/projectMonitoring/commentService');
const notificationService = require('../../services/projectMonitoring/notificationService');
const userService = require('../../services/authentication/user.service');
const webResponses = require('../../helpers/web/webResponses');
const { v4: uuidv4 } = require('uuid');
const projectValidator = require('../../validators/Project.validator');
const { formatErrorMessage } = require('../../helpers/utils/validator/formatError');
const generateRandomString = require('../../helpers/utils/generator/randomString');
const parseStringToBoolean = require('../../helpers/utils/parser/stringToBool');

async function createProject(req, res) {
    try {
        const isCreateProjectValid = projectValidator.isCreateProjectValid();

        if (!isCreateProjectValid(req.body)) {
            return res.status(400).json(webResponses.errorResponse(formatErrorMessage(isCreateProjectValid.errors[0])));
        }

        const payload = req.body;
        const projectId = uuidv4();

        payload.project.id = projectId;
        payload.project.passcode = generateRandomString();
        payload.project.start_project = new Date(payload.project.start_project);
        payload.project.end_project = new Date(payload.project.end_project);
        payload.project.creator_id = req.userId;
        payload.project.updater_id = req.userId;

        const project = await projectService.createProject(payload);

        res.status(201).json(webResponses.successResponse('Project created successfully!', project));
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function getAllProjects(req, res) {
    try {
        const isGetAllProjectValid = projectValidator.isGetAllProjectValid();

        const params = {
            page: Number(req.query.page),
            limit: Number(req.query.limit),
            search: req.query.search ?? '',
            sort: req.query.sort ?? 'created_at',
            order: req.query.order ?? 'desc',
            start_date: req.query.start_date,
            end_date: req.query.end_date,
            requesting_approval: parseStringToBoolean(req.query.requesting_approval),
            status: req.query.status
        };

        if (!params.page || params.page < 1) params.page = 1;
        if (!params.limit || params.limit < 1) params.limit = 10;
        if (!isGetAllProjectValid(params)) {
            return res.status(400).json(webResponses.errorResponse(formatErrorMessage(isGetAllProjectValid.errors[0])));
        }

        const project = await projectService.findAllProjects(params);

        const meta = {
            page: project.page,
            limit: project.limit,
            total_page: project.total_page,
            total: project.total,
            total_init: project.total_init,
            total_ongoing: project.total_ongoing,
            total_drop: project.total_drop,
            total_close_out: project.total_close_out
        }

        res.status(200).json(webResponses.successResponsePageCustom('Projects data fetched successfully!', meta, project.data));
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function getProject(req, res) {
    try {
        const projectId = req.params.id;
        const project = await projectService.findProject(projectId);

        if (project) {
            res.status(200).json(webResponses.successResponse('Project data fetched successfully!', project));
        }
        else {
            res.status(404).json(webResponses.errorResponse('Project not found!'));
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function updateProject(req, res) {
    try {
        const updatePicValidate = projectValidator.isUpdateProjectValid();

        if (!updatePicValidate(req.body)) {
            return res.status(400).json(webResponses.errorResponse(formatErrorMessage(updatePicValidate.errors[0])));
        }

        const projectId = req.params.id;
        const project = await projectService.findProject(projectId);

        if (project) {
            const payload = req.body;
            const isMember = project.members.some(member => member.access_credentials_id === req.userId);

            if (payload.project) {
                if (payload.project.start_project) {
                    payload.project.start_project = new Date(payload.project.start_project);
                }
                if (payload.project.end_project) {
                    payload.project.end_project = new Date(payload.project.end_project);
                }
            } else {
                payload.project = {};
            }
            payload.project.updater_id = req.userId;

            if (payload.project_ongoing) {
                if (payload.project_ongoing.start_access) {
                    payload.project_ongoing.start_access = new Date(payload.project_ongoing.start_access);
                }
                if (payload.project_ongoing.end_access) {
                    payload.project_ongoing.end_access = new Date(payload.project_ongoing.end_access);
                }
            }

            const updatedProject = await projectService.updateProject({
                projectId: project.id,
                projectInitId: project.project_init.id,
                projectOngoingId: project.project_ongoing.id,
                projectDropId: project.project_drop.id,
                projectCloseOutId: project.project_close_out.id,
                projectSolutionId: project.solution.id,
                isMember: isMember,
                payload: payload
            });

            res.status(200).json(webResponses.successResponse('Project updated successfully!', updatedProject));
        }
        else {
            res.status(404).json(webResponses.errorResponse('Project not found!'));
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function deleteProject(req, res) {
    try {
        const projectId = req.params.id;
        const project = await projectService.findProject(projectId);

        if (project) {
            const deletedProject = await projectService.deleteProject(projectId);

            res.status(200).json(webResponses.successResponse('Project deleted successfully!', deletedProject));
        }
        else {
            res.status(404).json(webResponses.errorResponse('Project not found!'));
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function sendApprovalRequest(req, res) {
    try {
        if (req.level != "STAFF") {
            return res.status(401).json(webResponses.errorResponse('Approval request can only be send by STAFF'));
        }

        const admins = await userService.findAllSuperAdmin();
        if (admins.length < 1) {
            return res.status(404).json(webResponses.errorResponse('Cannot process the request. SUPERADMIN account is missing!'));
        }

        const projectId = req.params.id;
        const { message } = req.body;

        const user = await userService.findAccessCredentialsById(req.userId);

        changeApprovalStatus({
            req: req,
            res: res,
            admins: admins,
            projectId: projectId,
            approvalStatus: 'requesting',
            approvalMessage: message,
            responseMsg: `${user.user_name} has been send the approval request`
        });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function approveApprovalRequest(req, res) {
    try {
        if (req.level != "SUPERADMIN") {
            return res.status(401).json(webResponses.errorResponse('Approval request can only be approved by SUPERADMIN'));
        }

        const projectId = req.params.id;
        const { message } = req.body;
        const user = await userService.findAccessCredentialsById(req.userId);

        changeApprovalStatus({
            req: req,
            res: res,
            projectId: projectId,
            approvalStatus: 'approved',
            approvalMessage: message,
            responseMsg: `${user.user_name} has been approved the approval request`
        });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function declineApprovalRequest(req, res) {
    try {
        if (req.level != "SUPERADMIN") {
            return res.status(401).json(webResponses.errorResponse('Approval request can only be declined by SUPERADMIN'));
        }

        const projectId = req.params.id;
        const { message } = req.body;
        const user = await userService.findAccessCredentialsById(req.userId);

        changeApprovalStatus({
            req: req,
            res: res,
            projectId: projectId,
            approvalStatus: 'declined',
            approvalMessage: message,
            responseMsg: `${user.user_name} has been declined the approval request`
        });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function changeApprovalStatus({ req, res, projectId, approvalStatus, approvalMessage, responseMsg, admins }) {
    try {
        const project = await projectService.findProject(projectId);

        let model;
        let identifier;
        if (project) {
            const isMember = project.members.some(member => member.access_credentials_id === req.userId);        
            const currentProjectstatus = project.status;

            switch (currentProjectstatus) {
                case 'initiation':
                    model = 'project_init';
                    identifier = project.project_init.id;
                    break;
                case 'ongoing':
                    model = 'project_ongoing';
                    identifier = project.project_ongoing.id;
                    break;
                case 'drop':
                    model = 'project_drop';
                    identifier = project.project_drop.id;
                    break;
                case 'close_out':
                    model = 'project_close_out';
                    identifier = project.project_close_out.id;
                    break;
                default:
                    throw new Error('Something went wrong!')
            }

            let newProjectStatus;
            if (approvalStatus == 'approved') {
                if (currentProjectstatus == 'initiation') newProjectStatus = 'ongoing';
                else if (currentProjectstatus == 'ongoing') newProjectStatus = 'close_out';
                else newProjectStatus = currentProjectstatus;
            }

            const result = await projectService.updateProjectApprovalStatus({
                projectId: projectId,
                model: model,
                identifier: identifier,
                projectStatus: newProjectStatus,
                approvalStatus: approvalStatus,
                isMember: isMember,
                updaterId: req.userId
            });

            await commentService.createComment({
                user_id: req.userId,
                message: responseMsg,
                project_id: project.id,
                comment_type: 'log'
            });

            await commentService.createComment({
                user_id: req.userId,
                message: approvalMessage,
                project_id: project.id,
                comment_type: 'comment'
            });

            let targets = project.members;
            if (admins && admins.length > 0) {
                const combined = targets.concat(admins);

                targets = combined.filter((item, index, self) =>
                    index === self.findIndex((t) => t.access_credentials_id === item.access_credentials_id)
                );
            }

            for (key in targets) {
                const member = targets[key];

                if (member.access_credentials_id != req.userId) {
                    await notificationService.createNotification({
                        sender_id: req.userId,
                        receiver_id: member.access_credentials_id,
                        header: responseMsg,
                        content: approvalMessage,
                        url: process.env.BASE_URL_FE + '/project-monitoring/project/' + project.id
                    });
                }
            }

            res.status(200).json(webResponses.successResponse(responseMsg, result));
        } else {
            res.status(404).json(webResponses.errorResponse('Project not found!'));
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}

module.exports = {
    createProject,
    getProject,
    getAllProjects,
    updateProject,
    deleteProject,
    sendApprovalRequest,
    approveApprovalRequest,
    declineApprovalRequest
}