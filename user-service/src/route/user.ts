import { Router } from "express";
import { login, logout, me, refreshToken, register } from "../controller/authentication";
import authorizeToken from "../middleware/authorizeToken";

const userRouter = Router();

userRouter.post("/login", login);
userRouter.post("/register", register);
userRouter.post("/refresh-token", refreshToken);
userRouter.get("/me", authorizeToken, me);
userRouter.post("/logout", logout);

export default userRouter;