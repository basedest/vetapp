CREATE TABLE branches (
    id SERIAL PRIMARY KEY,
    city VARCHAR(255) NOT NULL
);

CREATE TABLE clients (
     id SERIAL PRIMARY KEY,
     full_name VARCHAR(255) NOT NULL,
     animal_kind VARCHAR(255) NOT NULL,
     animal_name VARCHAR(255) NOT NULL,
     animal_gender VARCHAR(255) NOT NULL,
     last_visit DATE NOT NULL,
     total_spent INTEGER NOT NULL,
     total_visits INTEGER NOT NULL,
     regular_customer BOOLEAN NOT NULL
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    education VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    salary INTEGER NOT NULL,
    branch_id INTEGER,
    CONSTRAINT fk_branches
        FOREIGN KEY (branch_id)
        REFERENCES branches (id)
);

CREATE TABLE bonuses (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER,
    CONSTRAINT fk_employees
        FOREIGN KEY (employee_id)
        REFERENCES employees (id)
);

CREATE TABLE visits (
    id SERIAL PRIMARY KEY,
    procedures VARCHAR(255) NOT NULL,
    client_id INTEGER,
    employee_id INTEGER,
    CONSTRAINT fk_clients
        FOREIGN KEY (client_id)
        REFERENCES clients (id),
    CONSTRAINT fk_employees
        FOREIGN KEY (employee_id)
        REFERENCES employees (id)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INTEGER,
    CONSTRAINT fk_roles
        FOREIGN KEY (role_id)
        REFERENCES roles (id)
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    role VARCHAR(255) NOT NULL
);