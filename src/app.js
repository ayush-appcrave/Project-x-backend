import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import { config } from './config/appConfig.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import { requestTracer } from './middlewares/requestTracer.middleware.js';
const app = express();
const uploadsDir = path.resolve(process.cwd(), config.uploadsDir);
app.use('/api/v1/uploads', express.static(uploadsDir));

app.use(cors({ origin: config.frontend_domain, credentials: true }));

app.use(express.json({ limit: '16kb' })); // it use for json data

app.use(express.urlencoded({ extended: true })); // it use for url handling  / routes

app.use(cookieParser()); // use for cookies handling on server level

app.use(requestTracer);

import companyRoutes from './modules/company/company.routes.js';
import documentRoutes from './modules/documents/document.routes.js';
import userRoutes from './modules/users/user.routes.js';
import commentRoutes from './modules/comments/comment.routes.js';
//Routes Declarations
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/company', companyRoutes);
app.use('/api/v1/document', documentRoutes);
app.use('/api/v1/comment',commentRoutes);

// http://localhost:8080/api/v1/users/register

// The Error Handling Middleware should be placed at the end of all other middleware and route definitions to ensure it captures all errors.
app.use(errorHandler);
export { app };
