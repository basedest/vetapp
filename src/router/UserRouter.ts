import {Router} from "express";
import UserController from "../controller/UserController";
import {check} from "express-validator";
import {RoleMiddleware} from "../middleware/auth";

const router = Router();

router.get("/users", RoleMiddleware(["admin"]), UserController.getUsers);
router.post("/auth/register",
    check('username', "Username cannot be empty").notEmpty(),
    check('password', "Password should be from 4 to 12 symbols").isLength({min:4, max:12}),
    UserController.register);
router.post("/auth/login", UserController.login);

export default router;