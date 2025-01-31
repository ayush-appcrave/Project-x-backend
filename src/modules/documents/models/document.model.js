import { Schema, model } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const DocumentSchema = new Schema(
  {
    // The name of the document mean which i type in title box
    DocumentName: {
      type: String,
      required: true,
    },

    // Stores the type of entity this document belongs to company
    Type: {
      type: String,
      required: true,
    },

    // Reference ID of the associated entity like company
    TypeId: {
      type: Schema.Types.ObjectId,
      refPath: 'Type',
      required: true,
    },
    DocumentFileName: {
      type: String,
      required: true,
    },
    // URL where the document file is stored
    DocumentFileUrl: {
      type: String,
      required: true,
    },

    // The user who created the document
    CreatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // The user who last modified the document
    ModifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);
DocumentSchema.plugin(aggregatePaginate);

export const Document = model('Document', DocumentSchema);
