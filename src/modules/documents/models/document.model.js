import { Schema, model } from 'mongoose';

const CompanyDocumentSchema = new Schema(
  {
    // The name of the document
    DocumentName: {
      type: String,
      required: true,
    },

    // Stores the type of entity this document belongs to (Vendor, Client, Invoice, etc.)
    Type: {
      type: String,
      required: true,
    },

    // Reference ID of the associated entity
    TypeId: {
      type: Schema.Types.ObjectId,
      refPath: 'Type',
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
  { timestamps: true },
);

export const CompanyDocument = model('CompanyDocument', CompanyDocumentSchema);
