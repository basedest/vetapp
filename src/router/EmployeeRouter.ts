import {Router} from "express";
import EmployeeController from "../controller/EmployeeController";
import {RoleMiddleware} from "../middleware/auth";

const router = Router();
const mw = RoleMiddleware(["admin", "manager"]);

router.get("/employees", mw, EmployeeController.getAll);
router.get("/employees/:id", mw, EmployeeController.getOne);
router.post("/employees", mw, EmployeeController.create);
router.put("/employees/:id", mw, EmployeeController.update);
router.delete("/employees/:id", mw, EmployeeController.delete);
router.get("/employee/:id/bonus", mw, EmployeeController.getBonuses);
router.post("/employee/:id/bonus", mw, EmployeeController.giveBonus);
router.get("/employee/:id/visits", mw, EmployeeController.getVisits);
router.get("/employee/:id/appointments", mw, EmployeeController.getAppointmentCount);

export default router;