import {login, logout, refreshToken, register} from "../controller/authentication.js";
import {Router} from "express";
import authorizeToken from "../middleware/authorizeToken.js";

const userRouter = Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/refresh', authorizeToken, refreshToken);
userRouter.post('/logout', authorizeToken, logout)

export default userRouter;