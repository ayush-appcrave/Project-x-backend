import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { DocumentService } from './document.service.js';
import { documentUploadSchema } from './document.validation.js';

const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No file uploaded');
  }

  const { error } = documentUploadSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const uploadedFile = await DocumentService.uploadDocument(req.file, req.body, req.user._id);

  return res.status(201).json(new ApiResponse(201, uploadedFile, 'Document uploaded successfully'));
});

const getDocumentsByTypeId = asyncHandler(async (req, res) => {
  const { typeId } = req.params;
  const { page, limit } = req.query;
  if (!typeId) {
    throw new ApiError(400, 'TypeId is required');
  }

  const documents = await DocumentService.getDocumentsByTypeId(typeId, page, limit);

  return res.status(200).json(new ApiResponse(200, documents, 'Documents retrieved successfully'));
});
const deleteDocument = asyncHandler(async (req, res) => {
  const { documentId } = req.params;

  if (!documentId) {
    throw new ApiError(400, 'Document ID is required');
  }

  const deletedDocument = await DocumentService.deleteDocument(documentId);

  if (!deletedDocument) {
    throw new ApiError(404, 'Document not found');
  }

  return res.status(200).json(new ApiResponse(200, null, 'Document deleted successfully'));
});
export { deleteDocument, getDocumentsByTypeId, uploadDocument };
