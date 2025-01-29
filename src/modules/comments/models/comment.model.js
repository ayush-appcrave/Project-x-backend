import { Schema, model } from 'mongoose';

//type = vendor type  , client type , inovice type
//companyid  -> typeid

const CommentSchema = Schema(
  {
    ///it will store the type id of company type in it
    type: {
      type: String,
      required: true,
    },

    typeid: {
      type: Schema.Types.ObjectId,
      refPath: 'type',
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    createdby: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);
CommentSchema.index({ type: 1, typeid: 1 });
CommentSchema.index({ createdby: 1 });

export const Comment = model('Comment', CommentSchema);
