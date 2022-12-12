import {validationResult} from "express-validator";
import {Request, Response} from "express";
import repository from "../service/Repository";
import {RoleIds, User} from "../entities/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateAccessToken = (user: User) => {
    return jwt.sign({user}, process.env.JWT_SECRET!, {expiresIn: "7d"} )
}

class UserController {
    public async register(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors});
            }
            const {username, password} = req.body as {username: string, password: string};
            const candidate = await repository.getUser(username);
            if (candidate) {
                return res.status(400).json({message: "This username is already taken"});
            }
            const hashPassword = bcrypt.hashSync(password, 5);
            const user = await repository.createUser({username, password: hashPassword, role: RoleIds.EMPLOYEE});
            const token = generateAccessToken(user);
            return res.json({message: "Registration success", token, user});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Registration error'});
        }
    }
    public async login(req: Request, res: Response) {
        try {
            const {username, password} = req.body;
            const user = await repository.getUser(username);
            if (!user) {
                return res.status(400).json({message: `User ${username} not found`});
            }
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).json({message: `Incorrect password`});
            }
            const token = generateAccessToken(user);
            return res.json({token, user});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Login error'});
        }
    }

    public async getUsers(req: Request, res: Response) {
        try {
            const users = await repository.getUsers();
            res.json({users});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Get users error'});
        }
    }
}

export default new UserController();