import { Router } from 'express';
import { VerifyJwt } from '../../middlewares/auth.middleware.js';
import { upload } from '../../middlewares/multer.middleware.js';
import { deleteDocument, getDocumentsByTypeId, uploadDocument } from './document.controller.js';

const router = Router();

router.route('/upload-document').post(VerifyJwt, upload.single('file'), uploadDocument);
router.route('/get-documents/:typeId').get(VerifyJwt, getDocumentsByTypeId);
router.route('/delete-document/:documentId').delete(VerifyJwt, deleteDocument);

export default router;
