const dashboardService = require('../../services/projectMonitoring/dashboardService');
const webResponses = require('../../helpers/web/webResponses');
const dashboardValidator = require('../../validators/ProjectDashboard.validator');
const { formatErrorMessage } = require('../../helpers/utils/validator/formatError');

async function getProjectSummary(req, res) {
    try {
        const getSummaryValidate = dashboardValidator.isGetDashboardValid();

        if (!getSummaryValidate(req.query)) {
            return res.status(400).json(webResponses.errorResponse(formatErrorMessage(getSummaryValidate.errors[0])));
        }

        let startFromMonth = 0;
        switch (req.query.quarter) {
            case '1':
                startFromMonth = 1;
                break;
            case '2':
                startFromMonth = 4;
                break;
            case '3':
                startFromMonth = 7;
                break;
            case '4':
                startFromMonth = 10;
                break;

            default:
                break;
        }

        const params = {
            quarter: req.query.quarter,

            // Range date for selected quarter
            start_date: new Date(Number(req.query.year), startFromMonth - 1, 2),
            end_date: new Date(new Date(Number(req.query.year), startFromMonth + 2, 0).getTime() + 24 * 60 * 60 * 1000),

            // Range date for previous quarter
            start_date_compare: new Date(Number(req.query.year), startFromMonth - 4, 2),
            end_date_compare: new Date(new Date(Number(req.query.year), startFromMonth - 1, 0).getTime() + 24 * 60 * 60 * 1000)
        }

        const data = await dashboardService.fetchProjectSummary(params);

        res.status(200).json(webResponses.successResponse('Project summary fetched successfully!', data));
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function getProjectProgress(req, res) {
    try {
        const getProgressValidate = dashboardValidator.isGetDashboardValid();

        if (!getProgressValidate(req.query)) {
            return res.status(400).json(webResponses.errorResponse(formatErrorMessage(getProgressValidate.errors[0])));
        }

        let startFromMonth = 0;
        switch (req.query.quarter) {
            case '1':
                startFromMonth = 1;
                break;
            case '2':
                startFromMonth = 4;
                break;
            case '3':
                startFromMonth = 7;
                break;
            case '4':
                startFromMonth = 10;
                break;

            default:
                break;
        }

        const params = {
            quarter: req.query.quarter,

            // Range date for selected quarter
            start_date: new Date(Number(req.query.year), startFromMonth - 1, 2),
            end_date: new Date(new Date(Number(req.query.year), startFromMonth + 2, 0).getTime() + 24 * 60 * 60 * 1000)
        }

        const data = await dashboardService.fetchProjectProgress(params);

        res.status(200).json(webResponses.successResponse('Project progress fetched successfully!', data));
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function getProjectPartnership(req, res) {
    try {
        const getParternshipValidate = dashboardValidator.isGetDashboardValid();

        if (!getParternshipValidate(req.query)) {
            return res.status(400).json(webResponses.errorResponse(formatErrorMessage(getParternshipValidate.errors[0])));
        }

        let startFromMonth = 0;
        switch (req.query.quarter) {
            case '1':
                startFromMonth = 1;
                break;
            case '2':
                startFromMonth = 4;
                break;
            case '3':
                startFromMonth = 7;
                break;
            case '4':
                startFromMonth = 10;
                break;

            default:
                break;
        }

        const params = {
            quarter: req.query.quarter,

            // Range date for selected quarter
            start_date: new Date(Number(req.query.year), startFromMonth - 1, 2),
            end_date: new Date(new Date(Number(req.query.year), startFromMonth + 2, 0).getTime() + 24 * 60 * 60 * 1000)
        }

        const data = await dashboardService.fetchProjectPartnership(params);

        res.status(200).json(webResponses.successResponse('Project partnernship fetched successfully!', data));
    } catch (e) {
        console.log(e);
        throw e;
    }
}

module.exports = {
    getProjectSummary,
    getProjectProgress,
    getProjectPartnership
}