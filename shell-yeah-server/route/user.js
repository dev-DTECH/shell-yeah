import {login, logout, me, refreshToken, register} from "../controller/authentication.js";
import {Router} from "express";
import authorizeToken from "../middleware/authorizeToken.js";

const userRouter = Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/me', authorizeToken, me);
userRouter.post('/refreshToken', refreshToken);
userRouter.post('/logout', authorizeToken, logout)

export default userRouter;