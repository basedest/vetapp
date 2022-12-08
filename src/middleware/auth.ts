import jwt from 'jsonwebtoken';
import {Middleware} from "express-validator/src/base";
import {JWTPayloadWithUser, UserRole} from "../entities/user";

const secret = process.env.JWT_SECRET;

// panic if no secret is set
if (!secret) {
    console.error('JWT_SECRET is not set');
    process.exit(1);
}

export const AuthMiddleware : Middleware = (req, res, next) => {
    if (req.method === "OPTIONS") {
        next();
    }
    console.debug('AuthMiddleware');
    try {
        const token = req?.headers?.authorization?.split(' ')[1];
        if (!token) {
            return res.status(403).json({message: "Unauthenticated user"});
        }
        req.user = (jwt.verify(token, secret) as JWTPayloadWithUser).user;
        next();
    } catch (e) {
        console.log(e);
        return res.status(403).json({message: "Authentication failed"});
    }
}

export const RoleMiddleware = (allowedRoles: UserRole[]) => {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next();
        }
        console.debug('RoleMiddleware');
        try {
            const token = req?.headers?.authorization?.split(' ')[1];
            if (!token) {
                return res.status(403).json({message: "Unauthenticated user"});
            }
            const payload = jwt.verify(token, secret) as JWTPayloadWithUser;
            const user = payload.user;
            // console.debug('payload', payload);
            // console.debug('user', user);
            // console.debug('token', token);
            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({message: "You don't have enough permissions"});
            }
            next();
        } catch (e) {
            console.error(e);
            return res.status(403).json({message: "Authentication failed"});
        }
    } as Middleware;
}