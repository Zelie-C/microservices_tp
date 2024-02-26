import { Router } from "express";
import { TokenBlacklist, User } from "..";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { DecodedToken, verifyToken } from "../middlewares/verifyToken";
import { parse } from "path";

export const authRouter = Router();

authRouter.post('/register', async(req, res) => {
    try {
        const { email, password } = req.body;
        const uniqueMail = await User.findOne({ where: {email} });
        
        if (uniqueMail === null) {
            const saltRounds = 10;
            const hash = bcrypt.hash(password, saltRounds);
            await User.create({ 
                email: email,
                password: hash
            });
            res.status(200).json({message: 'User created'});
        } else {
            return res.status(400).json({message: 'Le couple email/password existe déjà'});
        }} catch (error) {
            console.error(error);
            res.status(400).json({message: 'Erreur lors de la création de l\'utilisateur'});
    }
});

authRouter.post('/login', async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: {email} });

    if(!user) {
        return res.status(400).json({message: 'Le couple email/password est invalide'});
    } else {
        const isPasswordValid = await bcrypt.compare(password, user.dataValues.password);
        if(isPasswordValid) {
            delete user.dataValues.password;
            const token = jwt.sign(user.dataValues, process.env.JWT_SECRET!);
            res.status(200).json({user, token});
        } else {
            return res.status(400).json({message: 'Email ou mot de passe invalide'});
        }
    }
});

authRouter.post('/change-password', verifyToken, async(req, res) => {
    const { oldPassword, newPassword, passwordConfirmation } = req.body;
    if (newPassword !== passwordConfirmation) {
        return res.status(400).json({message: 'Les mots de passe ne correspondent pas'});
    } else {
        const decoded = jwt.decode(req.token!) as DecodedToken;
        const user = await User.findOne({ where: {id: decoded.id} });
        if (user) {
            const isPasswordValid = await bcrypt.compare(oldPassword, user.dataValues.password);
            if (isPasswordValid) {
                const newHashedPassword = await bcrypt.hash(passwordConfirmation, parseInt(process.env.SALT_ROUNDS!));
                await user.update({ password: newHashedPassword });
                res.json("Mot de passe modifié");
            }
            else {
                res.status(400).json({message: 'Mot de passe actuel invalide'});
            }
        } else {
            res.status(404).json({message: 'Utilisateur non trouvé'});
        }
    } 
});

    authRouter.post('/logout', verifyToken, async(req, res) => {
        const decoded = jwt.decode(req.token!) as DecodedToken;
        const user = await User.findOne({ where: {id: decoded.id} });
        if(user) {
            await TokenBlacklist.create({ token: req.token! });
            res.status(200).json({message: 'User disconnected'});
        } else {
            res.status(404).json({message: 'User not found'});
        }
    });
