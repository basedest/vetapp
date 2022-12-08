import Repository from "../service/Repository";
import {Request, Response} from "express";

class VisitController {
    public async getVisits(req: Request, res: Response) {
        try {
            const visits = await Repository.getVisits();
            res.json({visits});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Get visits error'});
        }
    }
    public async getVisit(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({message: 'Incorrect visit id'});
            }
            const visit = await Repository.getVisitById(id);
            res.json({visit});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Get visit error'});
        }
    }

    public async createVisit(req: Request, res: Response) {
        try {
            const {visit} = req.body;
            await Repository.createVisit(visit);
            res.json({message: 'Visit created'});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Create visit error'});
        }
    }

    public async updateVisit(req: Request, res: Response) {
        try {
            const {visit} = req.body;
            await Repository.updateVisit(visit);
            res.json({message: 'Visit updated'});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Update visit error'});
        }
    }

    public async deleteVisit(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({message: 'Incorrect visit id'});
            }
            await Repository.deleteVisit(id);
            res.json({message: 'Visit deleted'});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Delete visit error'});
        }
    }
}

export default new VisitController();