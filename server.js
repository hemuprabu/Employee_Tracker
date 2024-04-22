const express = require('express');
const inquirer = require('inquirer');
// Import and require Pool (node-postgres)
// We'll be creating a Connection Pool. Read up on the benefits here: https://node-postgres.com/features/pooling
const { Pool } = require('pg');

const PORT = 3000;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const pool = new Pool(
  {
    // Enter PostgreSQL username
    user: 'postgres',
    // Enter PostgreSQL password
    password: 'sql123',
    host: 'localhost',
    database: 'employee_tracker_db'
},
console.log('Connected to the courses_db database!')
)

pool.connect();



app.get('/', (req, res) => {
    res.send('Hello, World!'); 
});

// Main function
async function main() {
    while (true) {
      const { choice } = await inquirer.prompt({
        type: 'list',
        name: 'choice',
        message: 'Options:',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Exit',
        ],
      });
  
      switch (choice) {
        case 'View all departments':
          await viewAllDepartments();
          break;
        case 'View all roles':
          await viewAllRoles();
          break;
        case 'View all employees':
          await viewAllEmployees();
          break;
        case 'Add a department':
          await addDepartment();
          break;
        case 'Add a role':
          await addRole();
          break;
        case 'Add an employee':
          await addEmployee();
          break;
        case 'Update an employee role':
          await updateEmployeeRole();
          break;
        case 'Exit':
          console.log('Exiting...');
          pool.end();
          return;
      }
    }
  }
  
  // Function to view all departments
  async function viewAllDepartments() {
    const query = 'SELECT * FROM departments';
    const result = await pool.query(query);
    console.table(result.rows);
  }
  
  // Function to view all roles
  async function viewAllRoles() {
    const query = 'SELECT roles.role_title, roles.role_id, departments.department_name, roles.role_salary FROM roles INNER JOIN departments ON roles.department_id = departments.department_id';
    const result = await pool.query(query);
    console.table(result.rows);
  }
  
  // Function to view all employees
  async function viewAllEmployees() {
    const query = 'SELECT employees.employee_id, employees.first_name, employees.last_name, roles.role_title, departments.department_name, roles.role_salary, employees.manager_id FROM employees INNER JOIN roles ON employees.role_id = roles.role_id INNER JOIN departments ON roles.department_id = departments.department_id';
    const result = await pool.query(query);
    console.table(result.rows);
  }
  
  // Function to add a department
  async function addDepartment() {
    const { department_name } = await inquirer.prompt({
      type: 'input',
      name: 'department_name',
      message: 'Enter the name of the department:',
      validate: function (input) {
        if (input.trim() === '') {
          return 'Department name cannot be empty';
        }
        return true;
      }
    });
    try{
      const countResult = await pool.query('SELECT COUNT(*) FROM departments');
      const count = parseInt(countResult.rows[0].count, 10);
    await pool.query('BEGIN');
    //const query = 'INSERT INTO departments (department_name) VALUES ($1) RETURNING department_id, [department_name]';
    const result =await pool.query('INSERT INTO departments (department_id, department_name) VALUES ($1) RETURNING department_id', [count + 1, department_name]);
    await pool.query('COMMIT');
    console.log('Department added successfully with ID:', result.rows[0].department_id);
    } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error adding department:', error.message);
  }
  }
  
  // Function to add a role
  async function addRole() {
    const departments = await pool.query('SELECT * FROM departments');
    const { role_title, role_salary, department_id } = await inquirer.prompt([
      {
        type: 'input',
        name: 'role_title',
        message: 'Enter the title of the role:',
      },
      {
        type: 'input',
        name: 'role_salary',
        message: 'Enter the salary for the role:',
      },
      {
        type: 'list',
        name: 'department_id',
        message: 'Choose the department for the role:',
        choices: departments.rows.map(departments => ({ name: departments.department_name, value: departments.department_id })),
      },
    ]);
    
    const query = 'INSERT INTO roles (role_title, role_salary, department_id) VALUES ($1, $2, $3)';
    await pool.query(query, [role_title, role_salary, department_id]);
    console.log('Role added successfully.');
  }
  
  // Function to add an employee
  async function addEmployee() {
    const roles = await pool.query('SELECT * FROM roles');
    const employees = await pool.query('SELECT * FROM employees');
    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
      {
        type: 'input',
        name: 'first_name',
        message: "Enter employee's first name:",
      },
      {
        type: 'input',
        name: 'last_name',
        message: "Enter employee's last name:",
      },
      {
        type: 'list',
        name: 'role_id',
        message: 'Choose the role for the employee:',
        choices: roles.rows.map(roles => ({ name: roles.role_title, value: roles.role_id })),
      },
      {
        type: 'list',
        name: 'manager_id',
        message: 'Choose the manager for the employee:',
        choices: [{ name: 'None', value: null }].concat(employees.rows.map(employees => ({ name: `${employees.first_name} ${employees.last_name}`, value: employees.employee_id }))),
      },
    ]);
    
    const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)';
    await pool.query(query, [first_name, last_name, role_id, manager_id]);
    console.log('Employee added successfully.');
  }
  
  // Function to update an employee role
  async function updateEmployeeRole() {
    const employees = await pool.query('SELECT * FROM employees');
    const roles = await pool.query('SELECT * FROM roles');
    const { employee_id, role_id } = await inquirer.prompt([
      {
        type: 'list',
        name: 'employee_id',
        message: 'Select the employee to update:',
        choices: employees.rows.map(employees => ({ name: `${employees.first_name} ${employees.last_name}`, value: employees.employee_id })),
      },
      {
        type: 'list',
        name: 'role_id',
        message: 'Select the new role for the employee:',
        choices: roles.rows.map(roles => ({ name: roles.role_title, value: roles.role_id })),
      },
    ]);
  
    const query = 'UPDATE employees SET role_id = $1 WHERE employee_id = $2';
    await pool.query(query, [role_id, employee_id]);
    console.log('Employee role updated successfully.');
  }
  
  // Start the application
  main();

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
