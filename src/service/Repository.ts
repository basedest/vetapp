import {Pool} from "pg";
import dbConnection from "../dbConnection";
import {Client} from "../entities/client";
import {Employee} from "../entities/employee";
import {Branch} from "../entities/branch";
import {Bonus} from "../entities/bonus";
import {Visit} from "../entities/visit";
import {idToRole, RoleIds, User, UserAuth, UserWithPassword} from "../entities/user";

class Repository {
    private db: Pool;

    constructor() {
        this.db = dbConnection;
    }

    public async getClients(): Promise<Client[]> {
        const res = await this.db.query("SELECT * FROM clients");
        return res.rows as Client[];
    }

    public async getClientById(id: number): Promise<Client> {
        const res = await this.db.query("SELECT * FROM clients WHERE id = $1", [id]);
        return res.rows[0] as Client;
    }

    public async updateClient(client: Client): Promise<void> {
        await this.db.query(
            "UPDATE clients SET full_name = $1, animal_kind = $2, animal_name = $3, animal_gender = $4, last_visit = $5, total_spent = $6, total_visits = $7, regular_customer = $8 WHERE id = $9",
            [client.full_name, client.animal_kind, client.animal_name, client.animal_gender, client.last_visit, client.total_spent, client.total_visits, client.regular_customer, client.id]
        );
    }

    public async createClient(client: Client): Promise<void> {
        await this.db.query(
            "INSERT INTO clients (full_name, animal_kind, animal_name, animal_gender, total_spent, total_visits, regular_customer) VALUES ($1, $2, $3, $4, 0, 0, false)",
            [client.full_name, client.animal_kind, client.animal_name, client.animal_gender]
        );
    }

    public async deleteClient(id: number): Promise<void> {
        await this.db.query("DELETE FROM clients WHERE id = $1", [id]);
    }

    public async getEmployees(): Promise<Employee[]> {
        const res = await this.db.query("SELECT * FROM employees_with_branches()");
        return res.rows;
    }

    public async getEmployeeById(id: number): Promise<Employee> {
        const res = await this.db.query("SELECT * FROM employees_with_branches() WHERE id = $1", [id]);
        return res.rows[0];
    }

    public async updateEmployee(employee: Employee): Promise<void> {
        await this.db.query(
            "UPDATE employees SET full_name = $1, education = $2, position = $3, salary = $4 WHERE id = $5",
            [employee.full_name, employee.education, employee.position, employee.salary, employee.id]
        );
    }

    public async createEmployee(employee: Employee): Promise<void> {
        const {id} = await (await this.db.query("SELECT id FROM branches WHERE city = $1", [employee.city])).rows[0];
        await this.db.query(
            "INSERT INTO employees (full_name, education, position, salary, branch_id) VALUES ($1, $2, $3, $4, $5)",
            [employee.full_name, employee.education, employee.position, employee.salary, id]
        );
    }

    public async deleteEmployee(id: number): Promise<void> {
        await this.db.query("DELETE FROM employees WHERE id = $1", [id]);
    }

    public async giveBonus(employee_id: number, day: Date): Promise<void> {
        await this.db.query("CALL give_bonus($1, $2)", [employee_id, day]);
    }

    public async getBranches(): Promise<Branch[]> {
        const res = await this.db.query("SELECT * FROM branches");
        return res.rows as Branch[];
    }

    public async getBranchById(id: number): Promise<Branch> {
        const res = await this.db.query("SELECT * FROM branches WHERE id = $1", [id]);
        return res.rows[0] as Branch;
    }

    public async createBranch(city: string): Promise<void> {
        await this.db.query(
            "INSERT INTO branches (city) VALUES ($1)",
            [city]
        );
    }

    public async getEmployeeVisits(employee_id: number): Promise<number[]> {
        const res = await this.db.query("SELECT * FROM employee_visits($1)", [employee_id]);
        return res.rows;
    }

    public async getEmployeeBonuses(employee_id: number): Promise<Bonus[]> {
        const res = await this.db.query("SELECT * FROM employee_bonuses($1)", [employee_id]);
        return res.rows;
    }

    public async getTotalAppointments(employee_id: number): Promise<number> {
        const res = await this.db.query("SELECT total_appointments($1)", [employee_id]);
        return res.rows[0].total_appointments;
    }

    public async getVisits(): Promise<Visit[]> {
        const res = await this.db.query("SELECT * FROM visits");
        return res.rows;
    }

    public async getVisitById(id: number): Promise<Visit> {
        const res = await this.db.query("SELECT * FROM visits WHERE id = $1", [id]);
        return res.rows[0];
    }

    public async createVisit(visit: Visit): Promise<void> {
        await this.db.query(
            "INSERT INTO visits (procedures, date, cost, client_id, employee_id) VALUES ($1, $2, $3, $4, $5)",
            [visit.procedures, visit.date, visit.cost, visit.client_id, visit.employee_id]
        );
    }

    public async updateVisit(visit: Visit): Promise<void> {
        await this.db.query(
            "UPDATE visits SET procedures = $1, date = $2, cost = $3, client_id = $4, employee_id = $5 WHERE id = $6",
            [visit.procedures, visit.date, visit.cost, visit.client_id, visit.employee_id, visit.id]
        );
    }

    public async deleteVisit(id: number): Promise<void> {
        await this.db.query("DELETE FROM visits WHERE id = $1", [id]);
    }

    public async getUser(login: string): Promise<UserWithPassword> {
        const res = await this.db.query("SELECT * FROM get_user($1)", [login]);
        return res.rows[0];
    }

    public async createUser(user: UserAuth): Promise<User> {
        const res = await this.db.query(
            "INSERT INTO users (username, password, role_id) VALUES ($1, $2, $3) RETURNING id, username, role_id",
            [user.username, user.password, user.role]
        );
        return {
            id: res.rows[0].id,
            username: res.rows[0].username,
            role: idToRole[res.rows[0].role_id as RoleIds]
        }
    }

    public async getUsers(): Promise<User[]> {
        const res = await this.db.query("SELECT * FROM get_users()");
        return res.rows;
    }
}

export default new Repository();