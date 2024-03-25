import webResponses from '../../helpers/web/webResponses';
import picService from '../../services/projectMonitoring/pic.service';
import { v4 as uuidv4 } from 'uuid';

async function createPicController(req, res, next) {
    try {
        const { name, phone } = req.body;

        if (!name || !phone) {
            res.status(400).json(webResponses.errorResponse('Invalid input! Fields cannot be empty'));
            throw new Error('There are several fields empty!');
        }

        const identifier = uuidv4();

        await picService.createPic({
            id: identifier,
            name: name,
            phone: phone
        });

        res.status(200).json(webResponses.successResponse('PIC created successfully!', { identifier, name, phone }));
    } catch (error) {
        console.log(error)
    }
}

export default {
    createPicController
}