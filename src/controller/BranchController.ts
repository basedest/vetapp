import repository from "../service/Repository";
import {Request, Response} from "express";

class BranchController {
    public async get(req: Request, res: Response) {
        try {
            const branches = await repository.getBranches();
            res.json({branches});
        } catch (e:any) {
            res.status(500).send({message: e.message});
        }
    }

    public async create(req: Request, res: Response) {
        try {
            await repository.createBranch(req.body.city);
            res.status(201).json({message: 'Branch created'});
        } catch (e:any) {
            res.status(500).send({message: e.message});
        }
    }
}

export default new BranchController();