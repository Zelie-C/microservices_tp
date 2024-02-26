import { Router } from "express";
import jwt from 'jsonwebtoken';
import { User } from "..";
import { DecodedToken, verifyToken } from "../middlewares/verifyToken";
export const userRouter = Router();

userRouter.get('/me', verifyToken, async(req, res) => {
    const decoded = jwt.decode(req.token!) as DecodedToken
    const user = await User.findOne({ where: {id: req.params.id} })
    if(user) {
        delete user.dataValues.password
        res.status(200).send(user)
    } else {
        res.status(404).send('User not found')
    }
})