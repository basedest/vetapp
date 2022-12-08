import {Router} from 'express';
import BranchController from "../controller/BranchController";
import {AuthMiddleware, RoleMiddleware} from "../middleware/auth";

const router = Router();

router.get("/branches", AuthMiddleware, BranchController.get);
router.post("/branches", RoleMiddleware(["admin"]), BranchController.create);

export default router;