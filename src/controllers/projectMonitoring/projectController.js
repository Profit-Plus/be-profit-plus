const projectService = require('../../services/projectMonitoring/projectService');
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

        res.status(200).json(webResponses.successResponsePage('Projects data fetched successfully!', project.page, project.limit, project.total, project.data));
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
            const isMember = project.members.some(member => member.id === req.userId);

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

function sendApprovalRequest(req, res) {
    try {
        const projectId = req.params.id;
        changeApprovalStatus({
            projectId: projectId,
            approvalStatus: 'requesting',
            res: res,
            responseMsg: 'Your approval request has been sent!'
        });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

function approveApprovalRequest(req, res) {
    try {
        const projectId = req.params.id;
        changeApprovalStatus({
            projectId: projectId,
            approvalStatus: 'approved',
            res: res,
            responseMsg: 'Approval request has been approved!'
        });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

function declineApprovalRequest(req, res) {
    try {
        const projectId = req.params.id;
        changeApprovalStatus({
            projectId: projectId,
            approvalStatus: 'declined',
            res: res,
            responseMsg: 'Approval request has been declined!'
        });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function changeApprovalStatus({ projectId, approvalStatus, res, responseMsg }) {
    try {
        const project = await projectService.findProject(projectId);

        let model;
        let identifier;
        if (project) {
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
                approvalStatus: approvalStatus
            });

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