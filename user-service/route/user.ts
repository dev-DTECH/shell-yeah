import { Router } from "express";
import { login, logout, refreshToken, register } from "../controller/authentication";
import authorizeToken from "../middleware/authorizeToken";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.post("/refresh-token", refreshToken);
authRouter.post("/verify", authorizeToken);
authRouter.post("/logout", logout);