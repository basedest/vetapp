import {Router} from "express";
import EmployeeController from "../controller/EmployeeController";
import {AuthMiddleware, RoleMiddleware} from "../middleware/auth";

const router = Router();
const mw = RoleMiddleware(["admin", "manager"]);

router.get("/employees", mw, EmployeeController.getAll);
router.post("/employees", mw, EmployeeController.create);
router.get("/employees/:id", mw, EmployeeController.getOne);
router.put("/employees/:id", mw, EmployeeController.update);
router.delete("/employees/:id", mw, EmployeeController.delete);
router.get("/employees/:id/bonus", mw, EmployeeController.getBonuses);
router.post("/employees/:id/bonus", mw, EmployeeController.giveBonus);
router.get("/employees/:id/visits", mw, EmployeeController.getVisits);
router.get("/employees/:id/appointments", AuthMiddleware, EmployeeController.getAppointmentCount);

export default router;