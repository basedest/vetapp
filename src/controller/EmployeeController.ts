import repository from "../service/Repository";
import {Request, Response} from "express";
import {validationResult} from "express-validator";

class EmployeeController {
    public async getAll(req: Request, res: Response) {
        try {
            const employees = await repository.getEmployees();
            res.json(employees);
        }
        catch (e) {
            console.log(e);
            res.status(400).json({message: 'Get employees error'});
        }
    }
    public async getOne(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({message: 'Invalid id'});
            }
            const employee = await repository.getEmployeeById(id);
            res.json(employee);
        }
        catch (e) {
            console.log(e);
            res.status(400).json({message: 'Get employee error'});
        }
    }

    public async create(req: Request, res: Response) {
        try {
            const {branch} = req.body;
            const {emp} = req.body;
            await repository.createEmployee(emp, branch);
            res.status(201).json({message: 'Employee created'});
        }
        catch (e) {
            console.log(e);
            res.status(400).json({message: 'Create employee error'});
        }
    }

    public async update(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const {emp} = req.body;
            if (isNaN(id) || emp?.id !== id) {
                return res.status(400).json({message: 'Invalid id'});
            }
            await repository.updateEmployee(emp);
            res.status(200).json({message: 'Employee updated'});
        }
        catch (e) {
            console.log(e);
            res.status(400).json({message: 'Update employee error'});
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({message: 'Invalid id'});
            }
            await repository.deleteEmployee(id);
            res.status(200).json({message: 'Employee deleted'});
        }
        catch (e) {
            console.log(e);
            res.status(400).json({message: 'Delete employee error'});
        }
    }

    public async getBonuses(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({message: 'Invalid id'});
            }
            const bonuses = await repository.getEmployeeBonuses(id);
            res.json(bonuses);
        }
        catch (e) {
            console.log(e);
            res.status(400).json({message: 'Get bonuses error'});
        }
    }

    public async giveBonus(req: Request, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors});
            }
            const id = parseInt(req.params.id);
            const {bonus} = req.body;
            if (isNaN(id)) {
                return res.status(400).json({message: 'Invalid id'});
            }
            await repository.giveBonus(id, bonus);
            res.status(200).json({message: 'Bonus given'});
        }
        catch (e) {
            console.log(e);
            res.status(400).json({message: 'Give bonus error'});
        }
    }

    public async getVisits(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({message: 'Invalid id'});
            }
            const visits = await repository.getEmployeeVisits(id);
            res.json(visits);
        }
        catch (e) {
            console.log(e);
            res.status(400).json({message: 'Get visits error'});
        }
    }

    public async getAppointmentCount(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({message: 'Invalid id'});
            }
            const count = await repository.getTotalAppointments(id);
            res.json(count);
        }
        catch (e) {
            console.log(e);
            res.status(400).json({message: 'Get appointment count error'});
        }
    }
}

export default new EmployeeController();