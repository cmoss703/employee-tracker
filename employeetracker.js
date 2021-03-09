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
                'Add Department',
                'Add Role',
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

                case 'Add Department':
                    addDept();
                    break;

                case 'Add Role':
                    addRole();
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

const addEmployee = () => {

    var roleChoices = [];
    var managers = [];

    connection.query(`SELECT id, title FROM roles`, (err, res) => {
        if (err) throw err;
        res.forEach(roles => {
            roleChoices.push(roles.title);
            return roleChoices;
        })
    });

    connection.query(`SELECT id, last_name FROM employee WHERE manager_id IS NULL`,
        (err, res) => {
            if (err) throw err;
            res.forEach(employee => {
                managers.push(employee.last_name);
                return managers;
            })
        });

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
            }
        ]).then((answer) => {

            let roleID;


            for (i=0; i < roleChoices.length; i++) {
                if (answer.roles == roleChoices[i]) {
                    roleID = (i+1);
                }
            };



            var employeeArray = [answer.first_name, answer.last_name, roleID];

            if (answer.roles !== "Manager") {
                // const insertEmpl = () => {
                inquirer.prompt({
                    name: "newManager",
                    type: "list",
                    message: "Which manager would you like to assign to this employee?",
                    choices: managers,
                }).then((response) => {

                    let managerID;

                    for (i=0; i < managers.length; i++) {
                        if (response.newManager == managers[i]) {
                            managerID = (i+1);
                        }
                    };

                    employeeArray.push(managerID);
                    insertEmpl();

                });
                // };

            }
            else { 
                employeeArray.push(null) 
                insertEmpl();
            };

            const insertEmpl = () => {
                connection.query(`INSERT INTO employee (first_name, last_name, roles_id, manager_id) VALUES (?, ?, ?, ?)`, employeeArray, (err) => {
                    if (err) throw err;

                    console.log(employeeArray[0] + ' ' + employeeArray[1] + ' was added as ' + answer.roles + '!');

                })

                // console.log(employeeArray);

                runPrompt();

            }

        });



};

const addDept = () => {

    inquirer
        .prompt([
            {
                name: "newDept",
                type: "input",
                message: "Please enter the name of the new department:",
            },
            {
                name: "salary",
                type: "input"
            }
        ])
            .then((answer) => {
                connection.query(`INSERT INTO roles (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, employeeArray, (err) => {
                    if (err) throw err;
                })
            })

};

const addRole = () => {
    inquirer
        .prompt([
            {
                name: "newRole",
                type: "input",
                message: "Please enter the title of the new role:",
            },            
            {
                name: "salary",
                type: "input",
                message: "Please enter the salary of the new role:"
            }
        ]).then((answer) => {

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