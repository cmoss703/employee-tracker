const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const sqlqueries = require('./assets/sqlqueries');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'pw',
    database: 'employeetrackerdb',
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Welcome to the Employee Tracker');
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
            switch (answer.start) {
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

    console.log('Viewing Employees');

    let query = `SELECT employee.id, 
        employee.first_name, 
        employee.last_name, 
        roles.title, 
        department.name AS department, 
        roles.salary
        FROM employee, roles, department 
        WHERE department.id = roles.department_id
        AND roles.id = employee.roles_id
        ORDER BY employee.id ASC
        `;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('----------------------------------------------------------------------');
        console.table(res);
        console.log('----------------------------------------------------------------------');
        runPrompt();
    });

};

const viewBydept = () => {


};

const viewByManager = () => {


};

const addEmployee = (roles) => {

    var roleChoices = [];

    connection.query(`SELECT id, title FROM roles`, (err, res) => {
        if (err) throw err;
        res.forEach(roles => {
            roleChoices.push(roles.title);
            return roleChoices;
        })
    });

    // console.log(roleChoices);

    inquirer
        .prompt([
            {
                name: "first_name",
                type: "input",
                message: "Please enter the employee's first name:",
            },
            {
                name: "last_name",
                type: "input",
                message: "Please enter the employee's last name:",
            },
            {
                name: "roles",
                type: "list",
                message: "Please choose a role for this employee:",
                choices: roleChoices,
                // choices() {
                //     roles.forEach(role => {
                //         choices.push(role.name);
                //     });
                //     return choices;
                // },
            }
        ]).then((answer) => {
            const fullName = [answer.first_name, answer.last_name];

        })

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

// concat(manager.first_name, ' ', manager.last_name) 
// AS manager 