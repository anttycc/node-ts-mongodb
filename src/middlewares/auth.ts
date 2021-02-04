import { Request, Response, NextFunction } from "express"
import { verifyToken } from '../services/jwt';
import PointModel, { IPoint } from '../models/PointModel';


export const bearerAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token: string = req.headers.authorization || '';
        const { valid, docodeToken }: any = verifyToken(token.replace('Bearer ', ""));
        if (valid) {
            (req as any).user = docodeToken.data;
            next();
        } else {
            next({ errorCode: 401, message: 'Unauthorized' });
        }
    } catch (e) {
        next({ errorCode: 401, message: e.message });
    }

};

export const authorizeAccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { params: { id }, query, body, user }: any = req;
        const isAllowed = await PointModel.count({ _id: id, author: user._id });
        if (isAllowed < 1) {
            next({ errorCode: 401, message: "Dont have permission to perform operation." });
            return;
        }
        next();
    } catch (e) {
        next({ errorCode: 401, message: e.message });
    }

};