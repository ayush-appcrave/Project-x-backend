import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { CommentService } from './comment.service.js';
import { commentSchema, updateCommentSchema, commentIdSchema } from './comment.validation.js';

const createComment = asyncHandler(async (req, res) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const newComment = await CommentService.createComment(req.body, req.user._id);
  return res.status(201).json(new ApiResponse(201, newComment, 'Comment added successfully'));
});

const getComments = asyncHandler(async (req, res) => {
  const { type, typeId } = req.query;
  if (!type || !typeId) {
    throw new ApiError(400, 'Type and TypeId are required');
  }

  const comments = await CommentService.getComments(type, typeId);
  return res.status(200).json(new ApiResponse(200, comments, 'Comments retrieved successfully'));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { error } = commentIdSchema.validate(req.params);
  if (error) {
    throw new ApiError(400, 'Invalid Comment ID');
  }

  await CommentService.deleteComment(req.params.commentId);
  return res.status(200).json(new ApiResponse(200, null, 'Comment deleted successfully'));
});

const updateComment = asyncHandler(async (req, res) => {
  const { error: paramError } = commentIdSchema.validate(req.params);
  if (paramError) {
    throw new ApiError(400, 'Invalid Comment ID');
  }

  const { error: bodyError } = updateCommentSchema.validate(req.body);
  if (bodyError) {
    throw new ApiError(400, bodyError.details[0].message);
  }

  const updatedComment = await CommentService.updateComment(req.params.commentId, req.body.Comment);
  return res.status(200).json(new ApiResponse(200, updatedComment, 'Comment updated successfully'));
});

export { createComment, deleteComment, getComments, updateComment };
