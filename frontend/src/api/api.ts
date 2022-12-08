import HTTPClient from "./client";
import {baseUrl} from "./config";
import {User} from "../entities/user";

interface ILoginResponse {
    token: string;
    user: User;
}

export default class Api {
    private client: HTTPClient;
    constructor() {
        this.client = new HTTPClient(baseUrl);
    }

    public async login(username: string, password: string): Promise<ILoginResponse> {
        const response = await this.client.post<ILoginResponse>('/login', { username, password });
        this.client.setToken(response.token);
        return response;
    }

    public async register(username: string, password: string): Promise<ILoginResponse> {
        const response = await this.client.post<ILoginResponse>('/register', { username, password});
        this.client.setToken(response.token);
        return response;
    }
}