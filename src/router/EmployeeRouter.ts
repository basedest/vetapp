import {Router} from "express";
import EmployeeController from "../controller/EmployeeController";

const router = Router();

router.get("/employees", EmployeeController.getAll);
router.get("/employees/:id", EmployeeController.getOne);
router.post("/employees", EmployeeController.create);
router.put("/employees/:id", EmployeeController.update);
router.delete("/employees/:id", EmployeeController.delete);
router.get("/employee/:id/bonus", EmployeeController.getBonuses);
router.post("/employee/:id/bonus", EmployeeController.giveBonus);
router.get("/employee/:id/visits", EmployeeController.getVisits);
router.get("/employee/:id/appointments", EmployeeController.getAppointmentCount);

export default router;