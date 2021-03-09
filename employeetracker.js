const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const util = require('util');

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
    mainMenu();
});

connection.query = util.promisify(connection.query);

const mainMenu = () => {
    inquirer
        .prompt({
            name: 'start',
            type: 'rawlist',
            message: 'What would you like to do?',
            choices: [
                'View All Employees',
                'Add Employee',
                'Add Department',
                'Add Role',
                'Remove Employee',
                'Update Employee Role',
                'View All Roles',
                'View All Departments',
            ],
        })
        .then((answer) => {
            switch (answer.start) {
                case 'View All Employees':
                    viewEmployees();
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
        roles.salary,
        manager_id
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
        mainMenu();
    });

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

            for (i = 0; i < roleChoices.length; i++) {
                if (answer.roles == roleChoices[i]) {
                    roleID = (i + 1);
                }
            };

            var employeeArray = [answer.first_name, answer.last_name, roleID];

            if (answer.roles !== "Manager") {

                inquirer.prompt({
                    name: "newManager",
                    type: "list",
                    message: "Which manager would you like to assign to this employee?",
                    choices: managers,
                }).then((response) => {

                    let managerID;

                    for (i = 0; i < managers.length; i++) {
                        if (response.newManager == managers[i]) {
                            managerID = (i + 1);
                        }
                    };

                    employeeArray.push(managerID);
                    insertEmpl();

                });

            }
            else {
                employeeArray.push(null)
                insertEmpl();
            };

            const insertEmpl = () => {
                connection.query(`INSERT INTO employee (first_name, last_name, roles_id, manager_id) VALUES (?, ?, ?, ?)`, employeeArray, (err) => {
                    if (err) throw err;

                    console.log('----------------------------------------------------------------------');
                    console.log(employeeArray[0] + ' ' + employeeArray[1] + ' was added as ' + answer.roles + '!');
                    console.log('----------------------------------------------------------------------');

                    mainMenu();

                });

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
            }
        ])
        .then((answer) => {
            connection.query(`INSERT INTO department (name) VALUE (?)`, answer.newDept, (err) => {
                if (err) throw err;

                console.log('----------------------------------------------------------------------');
                console.log("Department " + answer.newDept + " was added!")
                console.log('----------------------------------------------------------------------');

                mainMenu();
            })
        });

};

const addRole = () => {

    const deptChoices = [];

    connection.query(`SELECT id, name FROM department`, (err, res) => {
        if (err) throw err;
        res.forEach(department => {
            deptChoices.push(department.name);
            return deptChoices;
        })
    });

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
            },
            {
                name: 'whichDept',
                type: "list",
                message: "Which Department does this role belong to?",
                choices: deptChoices
            }
        ]).then((answer) => {

            let deptID;

            for (i = 0; i < deptChoices.length; i++) {
                if (answer.whichDept == deptChoices[i]) {
                    deptID = (i + 1);
                };
            };

            const roleArray = [answer.newRole, answer.salary, deptID];

            connection.query(`INSERT INTO roles (title, salary, department_id) VALUE (?, ?, ?)`, roleArray, (err) => {
                if (err) throw err;
                console.log('----------------------------------------------------------------------');
                console.log("Role " + answer.newRole + " was added in Department " + answer.whichDept + "!");
                console.log('----------------------------------------------------------------------');

                mainMenu();
            });

        });

};

const removeEmployee = async () => {

    var employees = await connection.query(`SELECT id, first_name, last_name FROM employee`);

    var employeeChoices = employees.map(employee =>
        `${employee.first_name} ${employee.last_name}`
    );

    inquirer
        .prompt([
            {
                name: "whichEmployee",
                type: "list",
                message: "Which employee would you like to remove?",
                choices: employeeChoices,
            },
            {
                name: "ruSure",
                type: "confirm",
                message: "Are you sure you want to delete this employee forever?"
            }
        ]).then((answer) => {

            let empID;

            for (i = 0; i < employeeChoices.length; i++) {
                if (answer.whichEmployee == employeeChoices[i]) {
                    empID = (i + 1);
                }
            };

            connection.query(`DELETE FROM employee WHERE id = ?`, empID, (err) => {
                if (err) throw err;

                console.log('----------------------------------------------------------------------');
                console.log(answer.whichEmployee + " was removed from this list. Forever. Bye bye! Hope they got their last paycheck...");
                console.log('----------------------------------------------------------------------');

                mainMenu();
            });

        })

};

const updateRole = async () => {

    var employees = await connection.query(`SELECT id, first_name, last_name FROM employee`);
    var newRoles = await connection.query(`SELECT id, title FROM roles`);

    var employeeChoices = employees.map(employee =>
        `${employee.first_name} ${employee.last_name}`
    );

    var newroleChoices = newRoles.map(role => role.title);

    inquirer
        .prompt([
            {
                name: "whichEmployee",
                type: "list",
                message: "Which employee would you like to update?",
                choices: employeeChoices,
            },
            {
                name: "newRole",
                type: "list",
                message: "Which role would you like to assign to this employee?",
                choices: newroleChoices,
            }
        ]).then((answer) => {

            let empID;
            let roleID;


            for (i = 0; i < newroleChoices.length; i++) {
                if (answer.newRole == newroleChoices[i]) {
                    roleID = (i + 1);
                }
            };

            for (i = 0; i < employeeChoices.length; i++) {
                if (answer.whichEmployee == employeeChoices[i]) {
                    empID = (i + 1);
                }
            };

            const updateroleArray = [roleID, empID];

            connection.query(`UPDATE employee SET roles_id = ? WHERE id = ?`, updateroleArray, (err) => {
                if (err) throw err;

                console.log('----------------------------------------------------------------------');
                console.log(answer.whichEmployee + " was updated to " + answer.newRole + " role!");
                console.log('----------------------------------------------------------------------');

                mainMenu();
            });

        });


};

const viewRoles = () => {

    console.log('Viewing All Roles');

    let query = `SELECT roles.id, 
        roles.title, 
        roles.salary, 
        roles.department_id, 
        department.name AS department
        FROM roles, department
        WHERE department.id = roles.department_id
        ORDER BY roles.id ASC
        `;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('----------------------------------------------------------------------');
        console.table(res);
        console.log('----------------------------------------------------------------------');
        mainMenu();
    });

};

const viewDepartments = () => {

    console.log('Viewing All Departments');

    let query = `SELECT department.id, 
        department.name
        FROM department
        ORDER BY department.id ASC
        `;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('----------------------------------------------------------------------');
        console.table(res);
        console.log('----------------------------------------------------------------------');
        mainMenu();
    });

};
