const notificationService = require('../../services/projectMonitoring/notificationService');
const webResponses = require('../../helpers/web/webResponses');
const notificationValidator = require('../../validators/Notification.validator');
const { formatErrorMessage } = require('../../helpers/utils/validator/formatError');

async function createNotification(req, res) {
    try {
        const isCreateNotificationValid = notificationValidator.isCreateNotificationValid();

        if (!isCreateNotificationValid(req.body)) {
            return res.status(400).json(webResponses.errorResponse(formatErrorMessage(isCreateNotificationValid.errors[0])));
        }

        const { receiver_id, header, content, url } = req.body;

        const result = await notificationService.createNotification({
            sender_id: req.userId,
            receiver_id: receiver_id,
            header: header,
            content: content,
            url: url
        });

        res.status(201).json(webResponses.successResponse('Notification created successfully!', result));
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function getAllNotifications(req, res) {
    try {
        const isGetAllNotificationValid = notificationValidator.isGetAllNotificationsValid();

        const params = {
            page: Number(req.query.page),
            limit: Number(req.query.limit),
            search: req.query.search ?? '',
            sort: req.query.sort ?? 'created_at',
            order: req.query.order ?? 'desc',                        
            start_date: req.query.start_date,
            end_date: req.query.end_date,
            receiver_id: req.userId
        };

        if (!params.page || params.page < 1) params.page = 1;
        if (!params.limit || params.limit < 1) params.limit = 10;
        if (!isGetAllNotificationValid(params)) {
            return res.status(400).json(webResponses.errorResponse(formatErrorMessage(isGetAllNotificationValid.errors[0])));
        }

        const notification = await notificationService.findAllNotifications(params);

        res.status(200).json(webResponses.successResponsePage('Notifications data fetched successfully!', notification.page, notification.limit, notification.total, notification.data));
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function getNotification(req, res) {
    try {
        const notificationId = req.params.id;

        const notification = await notificationService.findNotification(notificationId);

        if (notification) {
            res.status(200).json(webResponses.successResponse('Notification data fetched successfully!', notification));
        }
        else {
            res.status(404).json(webResponses.errorResponse('Notification not found!'));
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function deleteNotification(req, res) {
    try {
        const notificationId = req.params.id;

        const notification = await notificationService.findNotification(notificationId);

        if (notification) {
            const deletedNotification = await notificationService.deleteNotification(notificationId);

            res.status(200).json(webResponses.successResponse('Notification deleted successfully!', deletedNotification));
        }
        else {
            res.status(404).json(webResponses.errorResponse('Notification not found!'));
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}

module.exports = {
    createNotification,
    getNotification,
    getAllNotifications,
    deleteNotification
}