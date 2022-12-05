CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    animal_kind VARCHAR(255) NOT NULL,
    animal_name VARCHAR(255) NOT NULL,
    animal_sex VARCHAR(255) NOT NULL,
    last_visit DATE NOT NULL,
    total_spent NUMERIC(10,2) NOT NULL,
    total_visits INTEGER NOT NULL,
    regular_customer BOOLEAN NOT NULL
)