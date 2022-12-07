import repository from "../service/Repository";
import {Request, Response} from "express";

class BranchController {
    public async get(req: Request, res: Response) {
        try {
            const branches = await repository.getBranches();
            res.json(branches);
        } catch (e:any) {
            res.status(500).send({message: e.message});
        }
    }

    public create(req: Request, res: Response) {
        try {
            const branch = repository.createBranch(req.body.city);
            res.json(branch);
        } catch (e:any) {
            res.status(500).send({message: e.message});
        }
    }
}

export default new BranchController();