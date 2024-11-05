import {login, logout, me, refreshToken, register} from "../controller/authentication.js";
import {Router} from "express";
import authorizeToken from "../middleware/authorizeToken.js";
import {getTanks} from "../controller/tank.js";

const tankRouter = Router();

tankRouter.get('/', authorizeToken, getTanks);

export default tankRouter;