const { Prisma } = require('@prisma/client');
const projectService = require('../../services/projectMonitoring/projectService');
const webResponses = require('../../helpers/web/webResponses');
const { v4: uuidv4 } = require('uuid');
const projectValidator = require('../../validators/Project.validator');
const { formatErrorMessage } = require('../../helpers/utils/validator/formatError');

async function createProject(req, res) {
    try {
        const isCreateProjectValid = projectValidator.isCreateProjectValid();

        if (!isCreateProjectValid(req.body)) {
            return res.status(400).json(webResponses.errorResponse(formatErrorMessage(isCreateProjectValid.errors[0])));
        }        

        const data = req.body;
        const projectId = uuidv4();
        data['id'] = projectId;
        data['tarif'] = 0;
        data['passcode'] = 'abc242';
        
        const project = await projectService.createProject(data);

        res.status(200).json(webResponses.successResponse('Project created successfully!', project));

        // const result = await projectService.doTransaction([
        //     projectService.createProject(data),
        //     projectService.createProjectInit({ id: uuidv4(), project_id: projectId }),
        //     projectService.createProjectOngoing({ id: uuidv4(), project_id: projectId }),
        //     projectService.createProjectCloseOut({ id: uuidv4(), project_id: projectId }),
        //     projectService.createProjectDrop({ id: uuidv4(), project_id: projectId }),
        // ]);

        // if (result) {
        //     const updatedProject = await projectService.updateProject(
        //         projectId, 
        //         {
        //             project_init_id
        //         }
        //     );
        // } else {
        //     return res.status(400).json(webResponses.errorResponse('Create project failed!'));
        // }        
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
            role: req.query.role,
            start_date: req.query.start_date,
            end_date: req.query.end_date
        }

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
            const { name, phone, role } = req.body;

            const updatedProject = await projectService.updateProject(projectId, {
                name: name,
                phone: phone,
                role: role
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

module.exports = {
    createProject,
    getProject,
    getAllProjects,
    updateProject,
    deleteProject
};