import {Router} from "express";
import UserController from "../controller/UserController";

const router = Router();

router.get("/users", UserController.getUsers);
router.post("/auth/register", UserController.register);
router.post("/auth/login", UserController.login);

export default router;