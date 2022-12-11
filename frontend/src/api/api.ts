import HTTPClient from "./client";
import {baseUrl} from "./config";
import {User} from "../entities/user";
import {Branch} from "../entities/branch";
import {Employee} from "../entities/employee";
import {Visit} from "../entities/visit";
import {Bonus} from "../entities/bonus";
import {Client} from "../entities/client";

interface ILoginResponse {
    token: string;
    user: User;
}

export default class Api {
    private client: HTTPClient;
    constructor(token?: string) {
        this.client = new HTTPClient(baseUrl);
        if (token) {
            this.client.setToken(token);
        }
    }

    public async login(username: string, password: string): Promise<ILoginResponse> {
        const response = await this.client.post<ILoginResponse>("/auth/login", { username, password });
        this.client.setToken(response.token);
        return response;
    }

    public async register(username: string, password: string): Promise<ILoginResponse> {
        const response = await this.client.post<ILoginResponse>("/auth/register", { username, password});
        this.client.setToken(response.token);
        return response;
    }

    public async getUsers(): Promise<User[]> {
        const {users} = await this.client.get<{users: User[]}>("/users");
        return users;
    }

    public async getClients(): Promise<Client[]> {
        const {clients} = await this.client.get<{clients: Client[]}>("/clients");
        
        return clients;
    }

    public async getBranches(): Promise<Branch[]> {
        const {branches} = await this.client.get<{branches: Branch[]}>("/branches");
        return branches;
    }

    public async getEmployees(): Promise<Employee[]> {
        const {employees} = await this.client.get<{employees: Employee[]}>("/employees");
        return employees;
    }

    public async getVisits(): Promise<Visit[]> {
        const {visits} = await this.client.get<{visits: Visit[]}>("/visits");
        return visits;
    }

    public async getEmployeeVisits(employeeId: number): Promise<Visit[]> {
        const {visits} = await this.client.get<{visits: Visit[]}>(`/employees/${employeeId}/visits`);
        return visits;
    }

    public async getEmployeeBonuses(employeeId: number): Promise<Bonus[]> {
        const {bonuses} = await this.client.get<{bonuses: Bonus[]}>(`/employees/${employeeId}/bonuses`);
        return bonuses;
    }

    public async getEmployeeAppointmentCount(employeeId: number): Promise<number> {
        const {count} = await this.client.get<{count: number}>(`/employees/${employeeId}/appointments`);
        return count;
    }

    public async getClient(id: number): Promise<User> {
        const {user} = await this.client.get<{user: User}>(`/clients/${id}`);
        return user;
    }

    public async getEmployee(id: number): Promise<Employee> {
        const {employee} = await this.client.get<{employee: Employee}>(`/employees/${id}`);
        return employee;
    }

    public async getBranch(id: number): Promise<Branch> {
        const {branch} = await this.client.get<{branch: Branch}>(`/branches/${id}`);
        return branch;
    }

    public async getVisit(id: number): Promise<Visit> {
        const {visit} = await this.client.get<{visit: Visit}>(`/visits/${id}`);
        return visit;
    }

    public async createClient({client}: {client: Client}): Promise<true> {
        await this.client.post("/clients", {client});
        return true;
    }

    public async createVisit({visit}: {visit: Visit}): Promise<true> {
        await this.client.post("/visits", {visit});
        return true;
    }

    public async createEmployee({employee}: {employee: Employee}): Promise<true> {
        await this.client.post("/employees", {employee});
        return true;
    }

    public async giveBonus(employeeId: number, day: Date) {
        await this.client.post(`/employees/${employeeId}/bonus`, {day});
        return true;
    }

    public async updateClient({client}: {client: Client}): Promise<true> {
        await this.client.put(`/clients/${client.id}`, {client});
        return true;
    }

    public async updateVisit({visit}: {visit: Visit}): Promise<true> {
        await this.client.put(`/visits/${visit.id}`, {visit});
        return true;
    }

    public async updateEmployee({employee}: {employee: Employee}): Promise<true> {
        await this.client.put(`/employees/${employee.id}`, {employee});
        return true;
    }

    public async deleteClient(id: number): Promise<true> {
        await this.client.delete(`/clients/${id}`);
        return true;
    }

    public async deleteVisit(id: number): Promise<true> {
        await this.client.delete(`/visits/${id}`);
        return true;
    }

    public async deleteEmployee(id: number): Promise<true> {
        await this.client.delete(`/employees/${id}`);
        return true;
    }
}