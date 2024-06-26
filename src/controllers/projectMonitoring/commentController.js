const commentService = require('../../services/projectMonitoring/commentService');
const projectService = require('../../services/projectMonitoring/projectService');
const notificationService = require('../../services/projectMonitoring/notificationService');
const userService = require('../../services/authentication/user.service');
const webResponses = require('../../helpers/web/webResponses');
const commentValidator = require('../../validators/Comment.validator');
const { formatErrorMessage } = require('../../helpers/utils/validator/formatError');

async function createComment(req, res) {
    try {
        const isCreateCommentValid = commentValidator.isCreateCommentValid();

        if (!isCreateCommentValid(req.body)) {
            return res.status(400).json(webResponses.errorResponse(formatErrorMessage(isCreateCommentValid.errors[0])));
        }

        const { message, project_id } = req.body;

        const project = await projectService.findProject(project_id);

        if (project) {
            const user = await userService.findAccessCredentialsById(req.userId);

            const result = await commentService.createComment({
                user_id: req.userId,
                message: message,
                project_id: project_id
            });

            for (key in project.members) {
                const member = project.members[key];

                if (member.access_credentials_id != req.userId) {
                    await notificationService.createNotification({
                        sender_id: req.userId,
                        receiver_id: member.access_credentials_id,
                        header: `${user.user_name} commented on project ${project.topic}`,
                        content: message,
                        url: process.env.BASE_URL_FE + '/project-monitoring/project/' + project.id
                    });
                }
            }

            res.status(201).json(webResponses.successResponse('Comment created successfully!', result));
        } else {
            res.status(404).json(webResponses.errorResponse('Project not found!'));
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function getAllComments(req, res) {
    try {
        const isGetAllCommentValid = commentValidator.isGetAllCommentsValid();

        const params = {
            page: Number(req.query.page),
            limit: Number(req.query.limit),
            search: req.query.search ?? '',
            sort: req.query.sort ?? 'created_at',
            order: req.query.order ?? 'desc',
            comment_type: req.query.comment_type,
            project_id: req.query.project_id,
            start_date: req.query.start_date,
            end_date: req.query.end_date
        };

        if (!params.page || params.page < 1) params.page = 1;
        if (!params.limit || params.limit < 1) params.limit = 10;
        if (!isGetAllCommentValid(params)) {
            return res.status(400).json(webResponses.errorResponse(formatErrorMessage(isGetAllCommentValid.errors[0])));
        }

        const comment = await commentService.findAllComments(params);

        res.status(200).json(webResponses.successResponsePage('Comments data fetched successfully!', comment.page, comment.limit, comment.total, comment.data));
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function getComment(req, res) {
    try {
        const commentId = req.params.id;

        const comment = await commentService.findComment(commentId);

        if (comment) {
            res.status(200).json(webResponses.successResponse('Comment data fetched successfully!', comment));
        }
        else {
            res.status(404).json(webResponses.errorResponse('Comment not found!'));
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function updateComment(req, res) {
    try {
        const updatePicValidate = commentValidator.isUpdateCommentValid();

        if (!updatePicValidate(req.body)) {
            return res.status(400).json(webResponses.errorResponse(formatErrorMessage(updatePicValidate.errors[0])));
        }

        const commentId = req.params.id;

        const comment = await commentService.findComment(commentId);

        if (comment) {
            const { message } = req.body;

            const updatedComment = await commentService.updateComment(commentId, {
                message: message
            });

            res.status(200).json(webResponses.successResponse('Comment updated successfully!', updatedComment));
        }
        else {
            res.status(404).json(webResponses.errorResponse('Comment not found!'));
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function deleteComment(req, res) {
    try {
        const commentId = req.params.id;

        const comment = await commentService.findComment(commentId);

        if (comment) {
            const deletedComment = await commentService.deleteComment(commentId);

            res.status(200).json(webResponses.successResponse('Comment deleted successfully!', deletedComment));
        }
        else {
            res.status(404).json(webResponses.errorResponse('Comment not found!'));
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}

module.exports = {
    createComment,
    getComment,
    getAllComments,
    updateComment,
    deleteComment
}