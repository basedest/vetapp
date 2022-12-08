import {Router} from "express";
import VisitController from "../controller/VisitController";
import {AuthMiddleware} from "../middleware/auth";

const router = Router();
router.use(AuthMiddleware);

router.get("/visits", VisitController.getVisits);
router.get("/visits/:id", VisitController.getVisit);
router.post("/visits", VisitController.createVisit);
router.put("/visits/:id", VisitController.updateVisit);
router.delete("/visits/:id", VisitController.deleteVisit);

export default router;