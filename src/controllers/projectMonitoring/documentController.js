const { Prisma } = require('@prisma/client');
const documentService = require('../../services/projectMonitoring/documentService');
const webResponses = require('../../helpers/web/webResponses');
const documentValidator = require('../../validators/Document.validator');
const { formatErrorMessage } = require('../../helpers/utils/validator/formatError');
const filestream = require('fs');
const path = require('path');
const mv = require('mv');
const formidable = require('formidable');
const { v4: uuidv4 } = require('uuid');

async function createDocument(req, res) {
    try {
        const form = new formidable.IncomingForm();

        form.parse(req, async function (error, fields, files) {
            const allowedExts = ['pdf', 'docx'];
            const allowedDocTypes = ['nde', 'mom', 'requirement', 'baa', 'bast', 'report', 'nps'];
            let docType;
            let uploadedDoc;
            let fileExt;

            if (!files.document || files.document <= 0) {
                return res.status(400).json(webResponses.errorResponse('Invalid input! Field \'document\' must not be empty'));
            } else {
                uploadedDoc = files.document[0];
                fileExt = uploadedDoc.originalFilename.split('.').pop();
            }

            if (!fields.document_type || fields.document_type <= 0) {
                return res.status(400).json(webResponses.errorResponse('Invalid input! Field \'document_type\' must not be empty'));
            } else {
                docType = fields.document_type[0];
            }

            if (!allowedExts.includes(fileExt)) {
                return res.status(400).json(webResponses.errorResponse('Invalid input! File extension not allowed'));
            }

            if (!allowedDocTypes.includes(docType.toLowerCase())) {
                return res.status(400).json(webResponses.errorResponse('Invalid input! Field \'document_type\' must be equal to one of allowed values'));
            }

            if (error) {
                return res.status(400).json(webResponses.errorResponse('Upload document failed'));
            }

            const id = uuidv4();
            const newDocName = `${docType.toUpperCase()}_${id}.${fileExt}`;

            const uploadDir = path.join('src\\uploads', 'documents', docType.toUpperCase());
            filestream.mkdirSync(uploadDir, { recursive: true });

            const oldPath = uploadedDoc.filepath;
            const newPath = path.join(uploadDir, newDocName);

            mv(oldPath, newPath, async function (err) {
                if (err) {
                    return res.status(400).json(webResponses.errorResponse('Failed moving the document'));
                }

                const docData = {
                    id: id,
                    original_name: uploadedDoc.originalFilename,
                    document_name: newDocName,
                    mime_type: uploadedDoc.mimetype,
                    location: newPath,
                    document_type: docType.toLowerCase()
                }

                const document = await documentService.createDocument(docData);

                res.status(201).json(webResponses.successResponse('Document created successfully!', document));
            });
        });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function getAllDocuments(req, res) {
    try {
        const isGetAllDocumentsValid = documentValidator.isGetAllDocumentsValid();

        const params = {
            page: Number(req.query.page),
            limit: Number(req.query.limit),
            search: req.query.search ?? '',
            sort: req.query.sort ?? 'created_at',
            order: req.query.order ?? 'desc',
            start_date: req.query.start_date,
            end_date: req.query.end_date
        }

        if (!params.page || params.page < 1) params.page = 1;
        if (!params.limit || params.limit < 1) params.limit = 10;
        if (!isGetAllDocumentsValid(params)) {
            return res.status(400).json(webResponses.errorResponse(formatErrorMessage(isGetAllDocumentsValid.errors[0])));
        }

        const document = await documentService.findAllDocuments(params);

        res.status(200).json(webResponses.successResponsePage('Documents data fetched successfully!', document.page, document.limit, document.total, document.data));
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function getDocument(req, res) {
    try {
        const documentId = req.params.id;

        const document = await documentService.findDocument(documentId);

        if (document) {
            res.status(200).json(webResponses.successResponse('Document data fetched successfully!', document));
        }
        else {
            res.status(404).json(webResponses.errorResponse('Document not found!'));
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function downloadDocument(req, res) {
    try {
        const documentId = req.params.id;

        const document = await documentService.findDocument(documentId);

        if (document) {
            res.download(document.location);
        }
        else {
            res.status(404).json(webResponses.errorResponse('Document not found!'));
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function updateDocument(req, res) {
    try {
        const form = new formidable.IncomingForm();

        form.parse(req, async function (error, fields, files) {
            const allowedExts = ['pdf', 'docx'];
            const allowedDocTypes = ['nde', 'mom', 'requirement', 'baa', 'bast', 'report', 'nps'];
            let uploadedDoc;
            let fileExt;
            let docType;

            if (!files.document || files.document <= 0) {
                return res.status(400).json(webResponses.errorResponse('Invalid input! Field \'document\' must not be empty'));
            } else {
                uploadedDoc = files.document[0];
                fileExt = uploadedDoc.originalFilename.split('.').pop();
            }

            if (fields.document_type || fields.document_type > 0) {
                docType = fields.document_type[0];

                if (!allowedDocTypes.includes(docType.toLowerCase())) {
                    return res.status(400).json(webResponses.errorResponse('Invalid input! Field \'document_type\' must be equal to one of allowed values'));
                }
            }

            if (!allowedExts.includes(fileExt)) {
                return res.status(400).json(webResponses.errorResponse('Invalid input! File extension not allowed'));
            }

            if (error) {
                return res.status(400).json(webResponses.errorResponse('Upload document failed'));
            }

            const documentId = req.params.id;
            const document = await documentService.findDocument(documentId);

            if (document) {
                let docName = document.document_name;
                let uploadDir = document.location.split('\\');
                uploadDir.pop();
                uploadDir = uploadDir.toString().replaceAll(',', '\\');                

                if (docType && docType != document.document_type) {
                    uploadDir = path.join('src\\uploads', 'documents', docType.toUpperCase());
                    docName = `${docType.toUpperCase()}_${document.id}.${fileExt}`;
                }

                if (filestream.existsSync(document.location)) {
                    filestream.unlink(document.location, async function (err) {
                        if (err) throw new Error("Delete file failed!");
                    });
                }

                filestream.mkdirSync(uploadDir, { recursive: true });

                const oldPath = uploadedDoc.filepath;
                const newPath = path.join(uploadDir, docName);

                mv(oldPath, newPath, async function (err) {
                    if (err) {
                        console.log(err);
                        return res.status(400).json(webResponses.errorResponse('Failed moving the document'));
                    }

                    const docData = {
                        original_name: uploadedDoc.originalFilename,
                        document_name: docName,
                        mime_type: uploadedDoc.mimetype,
                        location: newPath,
                        document_type: docType.toLowerCase()
                    }

                    const updatedDoc = await documentService.updateDocument(documentId, docData);

                    res.status(200).json(webResponses.successResponse('Document updated successfully!', updatedDoc));
                });
            } else {
                res.status(404).json(webResponses.errorResponse('Document not found!'));
            }
        });
    } catch (e) {
        console.log(e);
        throw e;
    }
}

async function deleteDocument(req, res) {
    try {
        const documentId = req.params.id;

        const document = await documentService.findDocument(documentId);

        if (document) {
            filestream.stat(document.location, function (err) {
                if (err) {
                    throw new Error("File not found!");
                }

                filestream.unlink(document.location, async function (err) {
                    if (err) throw new Error("Delete file failed!");

                    const deletedDocument = await documentService.deleteDocument(documentId);

                    res.status(200).json(webResponses.successResponse('Document deleted successfully!', deletedDocument));
                });
            });
        }
        else {
            res.status(404).json(webResponses.errorResponse('Document not found!'));
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}

module.exports = {
    createDocument,
    getDocument,
    getAllDocuments,
    updateDocument,
    deleteDocument,
    downloadDocument
};