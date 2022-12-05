import jwt, {JwtPayload} from 'jsonwebtoken';
import {Middleware} from "express-validator/src/base";
import {UserRole} from "../entities/user";

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

    try {
        const token = req?.headers?.authorization?.split(' ')[1];
        if (!token) {
            return res.status(403).json({message: "Unauthenticated user"});
        }
        req.user = jwt.verify(token, secret);
        next();
    } catch (e) {
        console.log(e);
        return res.status(403).json({message: "Authentication failed"});
    }
}

export const RoleMiddleware = (role: UserRole) => {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next();
        }
        try {
            const token = req?.headers?.authorization?.split(' ')[1];
            if (!token) {
                return res.status(403).json({message: "Unauthenticated user"});
            }
            const {role: userRole} = jwt.verify(token, secret) as JwtPayload & { role: UserRole };
            if (userRole !== role) {
                return res.status(403).json({message: "Permission denied"});
            }
            next();
        } catch (e) {
            console.log(e);
            return res.status(403).json({message: "Authentication failed"});
        }
    } as Middleware;
}