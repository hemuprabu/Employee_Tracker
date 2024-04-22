DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;

\c employee_tracker_db;

-- Department Table
CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(30) UNIQUE NOT NULL
);

-- Role Table
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_title VARCHAR(30) UNIQUE NOT NULL,
    role_salary DECIMAL(10, 2) NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

-- Employee Table
CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES roles(role_id),
    FOREIGN KEY (manager_id) REFERENCES employees(employee_id)
);