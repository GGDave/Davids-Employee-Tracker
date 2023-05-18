const inquirer = require("inquirer");
const mysql = require("mysql2");

const dbConnect = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "",
    password: "",
    database: "",
});

dbConnect.connect((err) => {
    if (err) throw err;
    console.log("Connected to the database!");
    start();
});


function start() {
    inquirer
        .prompt({
            type: "list",
            name: "action",
            message: "Please select one of the following?",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee role",
                "Exit",
            ],
        })
        .then((answer) => {
            switch (answer.action) {
                case "View all departments":
                    viewAllDepartments();
                    break;
                case "View all roles":
                    viewAllRoles();
                    break;
                case "View all employees":
                    viewAllEmployees();
                    break;
                case "Add a department":
                        addDepartment();
                        break;
                    case "Add a role":
                        addRole();
                        break;
                    case "Add an employee":
                        addEmployee();
                        break;
                    case "Update an employee role":
                        updateEmployeeRole();
                        break;    
                case "Exit":
                    dbConnect.end();
                    console.log("CONNECTION...terminated...");
                    break; 
                    
                        
            }
        });
}

function viewAllDepartments() {
    const query = "SELECT * FROM departments";
    dbConnect.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

function viewAllRoles() {
    const query = "SELECT roles.title, roles.id, departments.department_name, roles.salary from roles join departments on roles.department_id = departments.id";
    dbConnect.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

function viewAllEmployees() {
    const query = `SELECT 
    e.id, 
    e.first_name, 
    e.last_name, 
    r.title, 
    r.salary, 
    CONCAT(m.first_name, ' ', m.last_name) AS manager_name
    FROM employee e
    LEFT JOIN roles r ON e.role_id = r.id
    LEFT JOIN employee m ON e.manager_id = m.id;`
    dbConnect.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
}

function addDepartment() {
    inquirer
        .prompt({
            type: "input",
            name: "departmentName",
            message: "Enter the name of the department:",
        })
        .then((answer) => {
            const query = "INSERT INTO departments (department_name) VALUES (?)";
            dbConnect.query(query, answer.departmentName, (err, res) => {
                if (err) throw err;
                console.log("Department added successfully!");
                start();
            });
        });
}

function addRole() {
    const queryDepartments = "SELECT department_name FROM departments";
    dbConnect.query(queryDepartments, (err, departments) => {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    type: "input",
                    name: "title",
                    message: "Enter the role title:",
                },
                {
                    type: "input",
                    name: "salary",
                    message: "Enter the salary for the role:",
                },
                {
                    type: "list",
                    name: "departmentName",
                    message: "Select the department for the role:",
                    choices: departments.map((d) => d.department_name),
                },
            ])
            .then((answer) => {
                const query = "INSERT INTO roles (title, salary, department_name) VALUES (?, ?, ?)";
                const values = [answer.title, answer.salary, answer.departmentName];
                dbConnect.query(query, values, (err, res) => {
                    if (err) throw err;
                    console.log("Role added successfully!");
                    start();
                });
            });
    });
}

function addEmployee() {
    // this command will fetch roles from the database
    const queryRoles = "SELECT id, title FROM roles";
    dbConnect.query(queryRoles, (err, roles) => {
        if (err) throw err;

        // this command will fetch managers from the database
        const queryManagers = "SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee";
        dbConnect.query(queryManagers, (err, managers) => {
            if (err) throw err;

            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "managerId",
                        message: "Select the manager for the employee:",
                        choices: managers.map((m) => ({ name: m.name, value: m.id })),
                    },
                    {
                        type: "input",
                        name: "firstName",
                        message: "Enter the employee's first name:",
                    },
                    {
                        type: "input",
                        name: "lastName",
                        message: "Enter the employee's last name:",
                    },
                    {
                        type: "list",
                        name: "roleId",
                        message: "Select the role for the employee:",
                        choices: roles.map((r) => ({ name: r.title, value: r.id })),
                    },
                ])
                .then((answer) => {
                    const query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                    const values = [answer.firstName, answer.lastName, answer.roleId, answer.managerId];
                    dbConnect.query(query, values, (err, res) => {
                        if (err) throw err;
                        console.log("Employee added successfully!");
                        start();
                    });
                });
        });
    });
}

