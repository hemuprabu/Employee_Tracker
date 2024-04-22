-- Inserting Data into the Department Table
INSERT INTO departments (department_id, department_name) VALUES
(1, 'Engineering'),
(2, 'Marketing'),
(3, 'Sales');

-- Inserting Data into the Role Table
INSERT INTO roles (role_id, role_title, role_salary, department_id) VALUES
(1, 'Software Engineer', 80000, 1),
(2, 'Marketing Manager', 70000, 2),
(3, 'Sales Representative', 60000, 3);

-- Inserting Data into the Employee Table
INSERT INTO employees (employee_id, first_name, last_name, role_id, manager_id) VALUES
(1, 'John', 'Doe', 1, NULL), -- Software Engineer with no manager
(2, 'Jane', 'Smith', 2, NULL), -- Marketing Manager with no manager
(3, 'Alice', 'Johnson', 3, 2); -- Sales Representative managed by Jane Smith
