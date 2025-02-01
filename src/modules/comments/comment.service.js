import mongoose from 'mongoose';
import { Comment } from './models/comment.model.js';
import { ApiError } from '../../utils/ApiError.js';

const CommentService = {
  createComment: async (commentData, userId) => {
    const { Comment: commentText, Type, TypeId } = commentData;

    const newComment = await Comment.create({
      Comment: commentText,
      Type,
      TypeId,
      CreatedBy: userId,
      ModifiedBy: userId,
    });

    if (!newComment) {
      throw new ApiError(500, 'Failed to save comment');
    }

    const populatedComment = await Comment.findById(newComment._id).populate('CreatedBy', 'FullName Email');

    return populatedComment;

    // return newComment;
  },

  getComments: async (type, typeId) => {

    if (!mongoose.Types.ObjectId.isValid(typeId)) {
      throw new ApiError(400, 'Invalid TypeId format');
    }
  
    const comments = await Comment.find({ Type: type, TypeId: typeId })
    .populate('CreatedBy', 'FullName Email') // Fetch only FullName and Email
    .lean() // Convert to plain JSON
    .sort({ createdAt: -1 });
  
    if (!comments || comments.length === 0) {
      throw new ApiError(404, 'No comments found');
    }
  
    return comments;
  },

  deleteComment: async (commentId) => {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      throw new ApiError(404, 'Comment not found');
    }

    await Comment.findByIdAndDelete(commentId);
    return { success: true, message: 'Comment deleted successfully' };
  },
};

export { CommentService };
