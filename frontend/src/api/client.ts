export default class HTTPClient {
    private token: string | null = null;
    constructor(private baseUrl: string) {}
    public setToken(token: string) {
        this.token = token;
    }

    public async get<T>(path: string): Promise<T> {
        const options = {
            method: 'GET',
            headers: {
                ...(this.token && { Authorization: `Bearer ${this.token}` })
            }
        };

        const response = await fetch(`${this.baseUrl}${path}`, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;
    }

    public async post<T>(path: string, body: any): Promise<T> {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { Authorization: `Bearer ${this.token}` })
            },
            body: JSON.stringify(body)
        };

        const response = await fetch(`${this.baseUrl}${path}`, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;
    }

    public async put<T>(path: string, body: any): Promise<T> {
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { Authorization: `Bearer ${this.token}` })
            },
            body: JSON.stringify(body)
        };

        const response = await fetch(`${this.baseUrl}${path}`, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;
    }

    public async delete<T>(path: string): Promise<T> {
        const options = {
            method: 'DELETE',
            headers: {
                ...(this.token && { Authorization: `Bearer ${this.token}` })
            }
        };

        const response = await fetch(`${this.baseUrl}${path}`, options);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;
    }
}