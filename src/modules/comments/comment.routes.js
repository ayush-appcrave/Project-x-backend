import { Router } from 'express';
import { VerifyJwt } from '../../middlewares/auth.middleware.js';
import { createComment, deleteComment, getComments, updateComment } from './comment.controller.js';

const router = Router();

router.use(VerifyJwt);

router.get('/', getComments);
router.post('/add-comments', createComment);
router.delete('/:commentId', deleteComment); 
router.put('/:commentId', updateComment);


export default router;
