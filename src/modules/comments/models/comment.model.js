import { Schema, model } from 'mongoose';

// Type represents the category of the comment (VendorType, ClientType, InvoiceType)
// TypeId refers to the associated Comment ID of the specific type

const CommentSchema = new Schema(
  {
    // Stores the type of entity being commented on (Vendor, Client, Invoice, etc.)
    Type: {
      type: String,
      required: true,
    },

    // Reference ID of the associated entity (Vendor, Client, or Invoice)
    TypeId: {
      type: Schema.Types.ObjectId,
      refPath: 'Type',
      required: true,
    },

    // The actual comment content
    Comment: {
      type: String,
      required: true,
    },

    // The user who created the comment
    CreatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Indexing for faster queries based on Type and TypeId
CommentSchema.index({ Type: 1, TypeId: 1 });
CommentSchema.index({ CreatedBy: 1 });

export const Comment = model('Comment', CommentSchema);
