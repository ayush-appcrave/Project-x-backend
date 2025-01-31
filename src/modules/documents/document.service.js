import fs from 'fs/promises';
import mongoose from 'mongoose';
import path from 'path';
import { config } from '../../config/appConfig.js';
import { ApiError } from '../../utils/ApiError.js';
import { Document } from './models/document.model.js'; // Ensure this model exists
const DocumentService = {
  uploadDocument: async (file, documentData, userId) => {
    const { DocumentName, Type, TypeId } = documentData;

    // Construct the file URL using path.join
    const fileUrl = path.join('/', config.uploadsDir, 'documents', file.filename);

    // Save document details in the database
    const document = await Document.create({
      DocumentName,
      Type,
      TypeId,
      DocumentFileName: file.originalname,
      DocumentFileUrl: fileUrl,
      CreatedBy: userId,
      ModifiedBy: userId,
    });

    if (!document) {
      throw new ApiError(500, 'Failed to save document');
    }

    return document;
  },
  getDocumentsByTypeId: async (typeId, page = 1, limit = 10) => {
    const pipeline = [
      { $match: { TypeId: new mongoose.Types.ObjectId(typeId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'CreatedBy',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $project: {
          DocumentName: 1,
          DocumentFileName: 1,
          DocumentFileUrl: 1,
          CreatedBy: { $first: '$user.FullName' },
          CreatedAt: {
            $dateToString: {
              format: '%Y-%m-%d %H:%M:%S',
              date: '$createdAt',
              timezone: 'Asia/Kolkata',
            },
          },
        },
      },
    ];
    // Paginate using mongoose-paginate-v2
    const options = {
      page,
      limit,
    };
    const documents = await Document.aggregatePaginate(Document.aggregate(pipeline), options);
    if (!documents) {
      throw new ApiError(404, 'No documents found');
    }
    if (!documents.docs || documents.docs.length === 0) {
      throw new ApiError(404, 'No documents found');
    }

    return {
      totalDocs: documents.totalDocs,
      totalPages: documents.totalPages,
      currentPage: documents.page,
      pageSize: documents.limit,
      documents: documents.docs,
    };
  },
  deleteDocument: async (documentId) => {
    const document = await Document.findById(documentId);
    if (!document) {
      throw new ApiError(404, 'Document not found');
    }

    // Get absolute path of the file
    const filePath = path.join(process.cwd(), document.DocumentFileUrl);

    try {
      // Delete file from filesystem
      await fs.unlink(filePath);

      // Delete document from database
      await Document.findByIdAndDelete(documentId);

      return { success: true, message: 'Document deleted successfully' };
    } catch (error) {
      throw new ApiError(500, 'Error deleting document');
    }
  },
};

export { DocumentService };
