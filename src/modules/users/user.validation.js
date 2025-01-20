import Joi from "joi";
import { UserRole } from "./user.model.js";
const registerSchema = Joi.object({
    username:Joi.string().required(),
    fullname:Joi.string().required(),
    email:Joi.string().email().required(),
    password:Joi.string().min(6).required(),
    role:Joi.string().valid(...Object.values(UserRole)).required()
})


export {registerSchema};