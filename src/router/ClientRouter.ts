import {Router} from "express";
import ClientController from "../controller/ClientController";
import {AuthMiddleware} from "../middleware/auth";

const router = Router();
router.use(AuthMiddleware);

router.get("/clients", ClientController.get);
router.post("/clients", ClientController.create);
router.put("/clients/:id", ClientController.update);
router.delete("/clients/:id", ClientController.delete);

export default router;