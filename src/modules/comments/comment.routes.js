import express from "express";
import { VerifyJwt } from '../../middlewares/auth.middleware.js';
import { getComments, createComment } from "./comment.controller.js";

const router = express.Router();

router.use(VerifyJwt);

router.get("/", getComments);
router.post("/add-comments", createComment);

export default router;
