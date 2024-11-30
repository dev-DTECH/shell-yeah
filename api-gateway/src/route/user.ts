import {login, logout, me, refreshToken, register} from "../controller/authentication";
import {Router} from "express";
import authorizeToken from "../middleware/authorizeToken";

const userRouter = Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/me', authorizeToken, me);
userRouter.post('/refreshToken', refreshToken);
userRouter.post('/logout', authorizeToken, logout)
userRouter.get('/', (req, res) => {
    res.status(200).json({ message: "Logout successful" })
})

export default userRouter;