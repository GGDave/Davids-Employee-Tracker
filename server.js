const inquirer = require("inquirer");// this line of code will import inquirer modules
const mysql = require("mysql2");// this line of code will import mysql modules

// in lines 5-11 we create a function  that will allow us to establish a connection to mysql database,
// when the required information is filled in the information will be stored as an object and passed 
//to the next function
const dbConnect = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "",
    password: "",
    database: "",
});

//the following function will use the paramaters from the function above to establish a connection 
dbConnect.connect((err) => {
    if (err) throw err;
    console.log("Connected to the database!");
    start();
});


function start() {// this line of code beggins the inquirer prompts
    inquirer
        .prompt({
            type: "list", //this parameter will display the information as a list
            name: "action", //this will store the users input under the property name of action that will be
            //passe to the switch statement
            message: "Please select one of the following?",//this will be the message displayed to the user
            choices: [
                //the following will be the choices displayed to the user 
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
            switch (answer.action) { //here we implement a switch stament, the switch statement allows us 
                //simplify our code where the alternative would be multiple else if statements
                //depending on the user selected option, this function evaluate the selection and if it matches
                // it will trigger the assosiated commands
                case "View all departments":
                    viewAllDepartments();
                    break;
                case "View all roles":
                    viewAllRoles();
                    break;
                case "View all employees":
                //eg. if the user selects viewALLEmployees this line of code will trigger, the actions of the 
                //command will be defined below as query statements that will access information from 
                //mysql database
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
                    
                        

function viewAllDepartments() { // in this function we associate the "case" from above to this function of 
    //viewAllDepartments, when the user selects that option this section of code will connect to mysql database
    // and input the following command to gather the required information
    const query = "SELECT * FROM departments";//this mysql input will retrieve information from departments table
    dbConnect.query(query, (err, res) => {//here we establish a connection with the associated query parameter
        if (err) throw err;
        console.table(res);
        start();
    });
}

function viewAllRoles() {// in this function we associate the "case" from above to this function of 
    //viewAllRoles, when the user selects that option this section of code will connect to mysql database
    // and input the following command to gather the required information
    const query = "SELECT * FROM roles";
    //mysql input will retrieve information from roles table
    dbConnect.query(query, (err, res) => {//here we establish a connection with the associated query parameters
        if (err) throw err;
        console.table(res);
        start();
    });
}

function viewAllEmployees() {// in this function we associate the "case" from above to this function of 
    //viewAllEmployees, when the user selects that option this section of code will connect to mysql database
    // and input the following command to gather the required information
    const query = "SELECT * FROM employee";//mysql input will retrieve information from roles table
    dbConnect.query(query, (err, res) => {//here we establish a connection with the associated query parameters
        if (err) throw err;
        console.table(res);
        start();
    });
}

function addDepartment() {//the following function will allow us to add a department 
    inquirer
        .prompt({
            type: "input",
            name: "departmentName",
            message: "Enter the name of the department:", //information displayed to the user
        })
        .then((answer) => {
            const query = "INSERT INTO departments (department_name) VALUES (?)";
            //this will be the command that will insert the information
            dbConnect.query(query, answer.departmentName, (err, res) => {
                if (err) throw err;
                console.log("Department added successfully!");
                start();
            });
        });
}

function addRole() {
    //the following function will allow us to add a role
    const queryDepartments = "SELECT department_name FROM departments";
    ////this will be the command that will insert the information
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
                        name: "roleId",
                        message: "Select the role for the employee:",
                        choices: roles.map((r) => ({ name: r.title, value: r.id })),
                    },
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
                ])
                .then((answer) => {
                    const query = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                    //this will be the command that will insert the information
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

function updateEmployeeRole() {//the following function will allow us to update an employee role
    // this command will fetch roles from the database
    const queryRoles = "SELECT id, title FROM roles";
    dbConnect.query(queryRoles, (err, roles) => {
        if (err) throw err;

        // this command will fetch employees from the database
        const queryEmployees = "SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee";
        dbConnect.query(queryEmployees, (err, employees) => {
            if (err) throw err;

            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "employeeId",
                        message: "Select the employee whose role you want to update:",
                        choices: employees.map((e) => ({ name: e.name, value: e.id })),
                    },
                    {
                        type: "list",
                        name: "roleId",
                        message: "Select the new role for the employee:",
                        choices: roles.map((r) => ({ name: r.title, value: r.id })),
                    }
                ])
                .then((answer) => {
                    const query = "UPDATE employee SET role_id = ? WHERE id = ?";
                    //this will be the command that will insert the information
                    const values = [answer.roleId, answer.employeeId];
                    dbConnect.query(query, values, (err, res) => {
                        if (err) throw err;
                        console.log("Employee role updated successfully!");
                        start();
                    });
                });
        });
    });
}