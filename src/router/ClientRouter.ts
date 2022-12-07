import {Router} from "express";
import ClientController from "../controller/ClientController";

const router = Router();

router.get("/clients", ClientController.get);
router.post("/clients", ClientController.create);
router.put("/clients/:id", ClientController.update);
router.delete("/clients/:id", ClientController.delete);

export default router;