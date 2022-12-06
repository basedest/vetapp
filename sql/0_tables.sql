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
    day DATE NOT NULL,
    amount INTEGER NOT NULL,
    CONSTRAINT fk_employees
        FOREIGN KEY (employee_id)
        REFERENCES employees (id)
        ON DELETE CASCADE
);

CREATE TABLE visits (
    id SERIAL PRIMARY KEY,
    procedures VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    cost INTEGER NOT NULL,
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

INSERT INTO roles (role)
VALUES
    ('admin'),
    ('user'),
    ('employee');
('manager');

INSERT INTO branches (city)
VALUES
    ('Москва'),
    ('Санкт-Петербург'),
    ('Екатеринбург'),
    ('Новосибирск'),
    ('Воронеж');

INSERT INTO employees (full_name, education, position, salary, branch_id)
VALUES
    ('Гольцов Иван Иванович', 'Высшее', 'Ветеринар', 50000, 1),
    ('Михалин Петр Петрович', 'Высшее', 'Ветеринар', 50000, 2),
    ('Рыбинцев Сидор Сидорович', 'Высшее', 'Ветеринар', 50000, 3),
    ('Карпов Алексей Алексеевич', 'Высшее', 'Ветеринар', 50000, 4),
    ('Рытов Александр Александрович', 'Высшее', 'Ветеринар', 50000, 5);

INSERT INTO clients (full_name, animal_kind, animal_name, animal_gender, last_visit, total_spent, total_visits, regular_customer)
VALUES
    ('Иванов Иван Иванович', 'Собака', 'Бобик', 'Мужской', '2021-01-01', 1500, 1, FALSE),
    ('Петров Петр Петрович', 'Собака', 'Шарик', 'Мужской', '2021-05-01', 2000, 1, FALSE),
    ('Сидоров Сидор Сидорович', 'Собака', 'Тузик', 'Мужской', '2022-03-01', 8500, 3, FALSE),
    ('Алексеев Алексей Алексеевич', 'Собака', 'Рекс', 'Мужской', '2022-02-01', 2500, 1, FALSE),
    ('Барсов Александр Александрович', 'Кот', 'Барс', 'Мужской', '2022-03-01', 3500, 1, FALSE);

INSERT INTO visits (procedures, date, cost, client_id, employee_id)
VALUES
    ('Обработка Бобика', '2021-01-01', 1500, 1, 1),
    ('Обработка Шарика', '2021-05-01', 2000, 2, 2),
    ('Обработка Тузика', '2022-01-01', 2500, 3, 3),
    ('Обработка Тузика (опять)', '2022-02-01', 2500, 3, 3),
    ('Обработка Тузика (еще раз)', '2022-03-01', 3500, 3, 3),
    ('Обработка Рекса', '2022-02-01', 2500, 4, 4),
    ('Обработка Барса', '2022-03-01', 3500, 5, 5);

-- scalar function that returns total visits for a client
CREATE OR REPLACE FUNCTION total_visits(client_id INTEGER) RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM visits WHERE client_id = $1);
END;
$$ LANGUAGE plpgsql;

-- scalar function that returns total appointments (future visits) for a employee
CREATE OR REPLACE FUNCTION total_appointments(employee_id INTEGER) RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM visits WHERE employee_id = $1 AND date > NOW());
END;

-- trigger after insert in visits that checks if client has more than 5 visits or spent at least 15k and if so, sets regular_customer to true
CREATE OR REPLACE FUNCTION check_regular_customer() RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT total_visits(NEW.client_id) > 5 OR (SELECT total_spent FROM clients WHERE id = NEW.client_id) > 15000) THEN
        UPDATE clients SET regular_customer = TRUE WHERE id = NEW.client_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_regular_customer AFTER INSERT ON visits FOR EACH ROW EXECUTE PROCEDURE check_regular_customer();

-- view that joins employees and their branches
CREATE OR REPLACE VIEW employees_with_branches AS
SELECT employees.full_name, employees.education, employees.position, employees.salary, branches.city
FROM employees
INNER JOIN branches ON employees.branch_id = branches.id;

-- table function that takes an employee id and returns all his visits
CREATE OR REPLACE FUNCTION employee_visits(employee_id INTEGER) RETURNS TABLE (procedures VARCHAR(255), date DATE, cost INTEGER, client_id INTEGER) AS $$
BEGIN
    RETURN QUERY SELECT procedures, date, cost, client_id FROM visits WHERE employee_id = employee_id;
END;
$$ LANGUAGE plpgsql;

-- table function that takes a employee id and returns all his bonuses
CREATE OR REPLACE FUNCTION employee_bonuses(employee_id INTEGER) RETURNS TABLE (bonus INTEGER) AS $$
BEGIN
    RETURN QUERY SELECT amount, day FROM bonuses WHERE employee_id = employee_id;
END;
$$ LANGUAGE plpgsql;

-- procedure that gives a bonus to an employee with fixed amount of 1000. It takes date and if it's not specified, it's set to current date
CREATE OR REPLACE PROCEDURE give_bonus(employee_id INTEGER, day DATE DEFAULT CURRENT_DATE) AS $$
BEGIN
    IF NOT EXISTS (SELECT * FROM bonuses WHERE employee_id = employee_id AND day = day) THEN
        INSERT INTO bonuses (employee_id, amount, day) VALUES (employee_id, 1000, day);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- function that returns employee by his id
CREATE OR REPLACE FUNCTION get_employee(employee_id INTEGER) RETURNS employees AS $$
BEGIN
    RETURN (SELECT * FROM employees WHERE id = employee_id);
END;
$$ LANGUAGE plpgsql;

-- procedure that hires new employee
CREATE OR REPLACE PROCEDURE hire_employee(full_name VARCHAR(255), education VARCHAR(255), position VARCHAR(255), salary INTEGER, branch_id INTEGER) AS $$
BEGIN
    INSERT INTO employees (full_name, education, position, salary, branch_id) VALUES (full_name, education, position, salary, branch_id);
END;
$$ LANGUAGE plpgsql;

-- procedure that fires employee
CREATE OR REPLACE PROCEDURE fire_employee(employee_id INTEGER) AS $$
BEGIN
    DELETE FROM employees WHERE id = employee_id;
END;
$$ LANGUAGE plpgsql;
