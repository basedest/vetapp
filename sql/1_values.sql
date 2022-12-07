INSERT INTO roles (role)
VALUES
    ('admin'),
    ('user'),
    ('employee'),
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
    ('Михалин Сергей Николаевич', 'Среднее', 'Ассистент', 20000, 2),
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

