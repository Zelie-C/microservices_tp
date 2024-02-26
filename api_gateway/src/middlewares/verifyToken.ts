import 'dotenv/config'
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { TokenBlacklist } from '..';

export interface DecodedToken {
    id: number;
    email: string;
    iat: number;
    exp: number;
}

export async function verifyToken(req: Request, res: Response, next: NextFunction) {
    const tokenHeader = req.headers.authorization
    if(!tokenHeader) {
        return res.status(401).send('No token provided')
    } else {
        const [typeToken, token] = tokenHeader.split(' ')
        if(typeToken !== 'Bearer') {
            return res.status(401).send('Invalid token type')
        } else {
            const isBlacklisted = await TokenBlacklist.findOne({ where: {token: token} })
            try {
                console.log('Token Extrait: ', token)
                const decoded = jwt.verify(token, process.env.JWT_SECRET!)
                if(decoded && !isBlacklisted) {
                    req.token = token
                    next()
                }
            } catch(err) {
                return res.status(401).send('Invalid token')
            }
        }
        }
}