import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/app_error';
import { verifyToken } from '../utils/genarate_token';
import { configs } from '../configs';
import { TJwtUser } from '../modules/auth/auth.interface';

type Role = "ADMIN" | "USER"


const auth = (...roles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                throw new AppError('You are not authorize!!', 401);
            }
            const verifiedUser = verifyToken(
                token,
                configs.jwt.access_token as string,
            );
            if (!roles.length || !roles.includes(verifiedUser.role)) {
                throw new AppError('You are not authorize!!', 401);
            }
            req.user = verifiedUser as TJwtUser;
            next();
        } catch (err) {
            next(err);
        }
    };
};

export default auth;