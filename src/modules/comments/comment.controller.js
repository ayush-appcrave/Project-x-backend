import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { CommentService } from './comment.service.js';
import { commentSchema } from './comment.validation.js';

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
  console.log('Fetched Comments:', comments);

  return res.status(200).json(new ApiResponse(200, comments, 'Comments retrieved successfully'));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId) {
    throw new ApiError(400, 'Comment ID is required');
  }

  const deletedComment = await CommentService.deleteComment(commentId);

  return res.status(200).json(new ApiResponse(200, null, 'Comment deleted successfully'));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { Comment: commentText } = req.body;

  if (!commentId || !commentText) {
    throw new ApiError(400, 'Comment ID and text are required');
  }

  const updatedComment = await CommentService.updateComment(commentId, commentText);

  return res.status(200).json(new ApiResponse(200, updatedComment, 'Comment updated successfully'));
});

export { createComment, deleteComment, getComments, updateComment };
