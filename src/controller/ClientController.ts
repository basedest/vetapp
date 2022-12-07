import {Request, Response} from "express";
import repository from "../service/Repository";

class ClientController {
    public async get(req: Request, res: Response) {
        try {
            const clients = await repository.getClients();
            res.json(clients);
        } catch (e:any) {
            res.status(500).send({message: e.message});
        }
    }

    public async create(req: Request, res: Response) {
        try {
            const {client:payload} = req.body;
            const client = await repository.createClient(payload);
            res.json(client);
        } catch (e:any) {
            res.status(500).send({message: e.message});
        }
    }

    public async update(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const {client:payload} = req.body;
            if (isNaN(id) || payload?.id !== id) {
                return res.status(400).json({message: 'Invalid id'});
            }
            const client = await repository.updateClient(payload);
            res.json(client);
        } catch (e:any) {
            res.status(500).send({message: e.message});
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({message: 'Invalid id'});
            }
            const client = await repository.deleteClient(id);
            res.json(client);
        } catch (e:any) {
            res.status(500).send({message: e.message});
        }
    }
}

export default new ClientController();