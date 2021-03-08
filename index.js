const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3303,
    user: 'root',
    password: 'pw',
    database: 'employee_tracker'
});

connection.connect((err) => {
    if (err) throw err;
    runPrompt();
});

const runPrompt = () => {
    inquirer
        .prompt({
            name: 'start',
            type: 'rawlist',
            message: 'What would you like to do?',
            choices: [
                'View All Employees',
                'View All Employees by Department',
                'View All Employees by Manager',
                'Add Employee',
                'Remove Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'View All Roles',
                'View All Departments',
            ],
        })
        .then((answer) => {
            switch (answer.action) {
                case 'View All Employees':
                    viewEmployees();
                    break;

                case 'View All Employees by Department':
                    viewBydept();
                    break;

                case 'View All Employees by Manager':
                    viewByManager();
                    break;

                case 'Add Employee':
                    addEmployee();
                    break;

                case 'Remove Employee':
                    removeEmployee();
                    break;

                case 'Update Employee Role':
                    updateRole();
                    break;

                case 'Update Employee Manager':
                    updateManager();
                    break;

                case 'View All Roles':
                    viewRoles();
                    break;

                case 'View All Departments':
                    viewDepartments();
                    break;

                default:
                    console.log(`Invalid action: ${answer.action}`);
                    break;
            }
        });
};

 const viewEmployees = () => {

    
 };

 const viewBydept = () => {

    
};

const viewByManager = () => {


};

const addEmployee = () => {

    
};

const removeEmployee = () => {

   
};

const updateRole = () => {


};

const updateManager = () => {

    
};

const viewRoles = () => {

   
};

const viewDepartments = () => {


};