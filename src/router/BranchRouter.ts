import {Router} from 'express';
import BranchController from "../controller/BranchController";

const router = Router();

router.get("/branches", BranchController.get);
router.post("/branches", BranchController.create);

export default router;