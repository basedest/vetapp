
-- scalar function that returns total visits for a client
CREATE OR REPLACE FUNCTION total_visits(client_id INTEGER) RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM visits WHERE visits.client_id = $1);
END;
$$ LANGUAGE plpgsql;

-- scalar function that returns total appointments (future visits) for a employee
CREATE OR REPLACE FUNCTION total_appointments(employee_id INTEGER) RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM visits WHERE visits.employee_id = $1 AND date > NOW());
END;
$$ LANGUAGE plpgsql;

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
CREATE OR REPLACE VIEW employees_with_branches_view AS
SELECT emp.full_name, emp.education, emp.position, emp.salary, branches.city
FROM employees AS emp
INNER JOIN branches ON emp.branch_id = branches.id;

-- table function that returns all employees with their ids and branches
CREATE OR REPLACE FUNCTION employees_with_branches() RETURNS TABLE(id INTEGER, full_name VARCHAR, education VARCHAR, "position" VARCHAR, salary INTEGER, city VARCHAR) AS $$
BEGIN
    RETURN QUERY SELECT emp.id, emp.full_name, emp.education, emp.position, emp.salary, branches.city
                 FROM employees AS emp
                          INNER JOIN branches ON emp.branch_id = branches.id;
END;
$$ LANGUAGE plpgsql;

-- table function that takes an employee id and returns all his visits
CREATE OR REPLACE FUNCTION employee_visits(employeeId INTEGER) RETURNS TABLE (visit_id INTEGER, "procedures" VARCHAR(255), "date" DATE, "cost" INTEGER, clientId INTEGER) AS $$
BEGIN
    RETURN QUERY SELECT id, visits.procedures, visits.date, visits.cost, visits.client_id FROM visits WHERE employeeId = visits.employee_id;
END;
$$ LANGUAGE plpgsql;

-- table function that takes a employee id and returns all his bonuses
CREATE OR REPLACE FUNCTION employee_bonuses(employeeId INTEGER) RETURNS TABLE (bonus INTEGER) AS $$
BEGIN
    RETURN QUERY SELECT id, amount, day FROM bonuses WHERE employeeId = bonuses.employee_id;
END;
$$ LANGUAGE plpgsql;

-- procedure that gives a bonus to an employee with fixed amount of 1000. It takes date and if it's not specified, it's set to current date
CREATE OR REPLACE PROCEDURE give_bonus(employeeId INTEGER, newDay DATE DEFAULT CURRENT_DATE) AS $$
BEGIN
    IF NOT EXISTS (SELECT * FROM bonuses WHERE employeeId = employee_id AND newDay = day) THEN
        INSERT INTO bonuses (employee_id, amount, day) VALUES (employeeId, 1000, newDay);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- function that returns users with role instead of its id
CREATE OR REPLACE FUNCTION get_users() RETURNS TABLE (id INTEGER, username VARCHAR, "role" VARCHAR) AS $$
BEGIN
    RETURN QUERY SELECT users.id, users.username, roles.role FROM users INNER JOIN roles ON users.role_id = roles.id;
END;
$$ LANGUAGE plpgsql;

-- function that returns user with role instead of its id (also password as we need it for login)
CREATE OR REPLACE FUNCTION get_user(login VARCHAR) RETURNS TABLE (id INTEGER, username VARCHAR, password VARCHAR, "role" VARCHAR) AS $$
BEGIN
    RETURN QUERY SELECT users.id, users.username, users.password, roles.role FROM users INNER JOIN roles ON users.role_id = roles.id WHERE users.username = login;
END;
$$ LANGUAGE plpgsql;
