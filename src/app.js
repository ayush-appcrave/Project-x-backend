import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config/appConfig.js";
const app = express();

app.use(cors({ origin: config.frontend_domain, credentials: true }));

app.use(express.json({ limit: "16kb" })); // it use for json data

app.use(express.urlencoded({ extended: true })); // it use for url handling  / routes

app.use(express.static("public")); // it is use to store files like data from pdf or images etc

app.use(cookieParser()); // use for cookies handling on server level

//Routes
import userRoutes from "./modules/users/user.routes.js";
//Routes Declarations
app.use("/api/v1/users", userRoutes);


// http://localhost:8080/api/v1/users/register

export { app };
