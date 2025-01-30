import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { config } from './config/appConfig.js';
import { requestTracer } from './middlewares/requestTracer.middleware.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

const app = express();

app.use(cors({ origin: config.frontend_domain, credentials: true }));

app.use(express.json({ limit: '16kb' })); // it use for json data

app.use(express.urlencoded({ extended: true })); // it use for url handling  / routes

app.use(express.static('public')); // it is use to store files like data from pdf or images etc

app.use(cookieParser()); // use for cookies handling on server level

app.use(requestTracer);

//Routes
import userRoutes from './modules/users/user.routes.js';
import companyRoutes from './modules/company/company.routes.js';
//Routes Declarations
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/company',companyRoutes);




// http://localhost:8080/api/v1/users/register

// The Error Handling Middleware should be placed at the end of all other middleware and route definitions to ensure it captures all errors.
app.use(errorHandler);

export { app };


