const mysql = require("mysql2");
const { prompt } = require("inquirer");
require("console.table");

//Create the connection to database 
const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'ariel2008',
    database: 'employee_tracker',
});

connection.connect(function (err) {
    if (err) throw err;
    firstPrompt();
});

function firstPrompt() {
    prompt([
        {
            type: 'list',
            name: 'userChoice',
            message: 'What would you like to do first?',
            choices: ['VIEW ALL','View All Departments','View All Employees','View All Roles','Add New Department','Add New Role','Add New Employee','Update Employee Role','Quit prmopts',],
        },
    ])
    .then((res) => {
        console.log(res.userChoice);
        switch(res.userChoice){
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'View Employees By Department':
                viewEmployeesByDepartment();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Remove Employee':
                removeEmployee();
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Exit':
                connection.end();
                break;
            }

        }).catch((err) => {
    if(err) throw err;
    });
}

// Employees
function viewAllEmployees() {
    let query =
    `SELECT 
        employee.id,
        employee.first_name,
        employee.last_name,
        role.title,
        department.name AS department,
        role.salary,
        CONCAT(manager.first_name,'', manager.last_name) AS manager
    FROM employee
    LEFT JOIN role
        ON empoyee.role_id = role.id
    LEFT JOIN department 
        ON department.id = role.department_id
    LEFT JOIN employeer manager
        ON manager.id = employee.manager_id`

    connection.query(query, (err, res)=> {
        if (err) throw err;
        console.table(res);
        firstPrompt();
    });
}

//VIEW EMPLOYEES BY DEPARTMENT 
function viewEmployeesByDepartment() {
    let query =
    `SELECT
         department.id,
         department.name,
         role.salary,
    FROM employee
    LEFT JOIN role
         ON employee.role_id = role.id
    GROUP BY department.id, deparment.name, role.salary`;

connection.query(query,(err, res)=>{
    if (err) throw err;
    const deptChoices = res.map((choices) => ({
        value: choices.id, name: choices.name
    }));
    console.table(res);
    getDept(deptChoices);
  });
}

//GET DEPARTMENT
function getDept(deptChoices){
    inquirer
    .prompt([
        {
            type:'list',
            name:'department',
            message:'Departments:',
            choices: deptChoices
        }
    ]).then((res) => {
    let query = `SELECT 
                     employee.id,
                     employee.first_name,
                     employee.last_name,
                     role.title,
                     department.name
                FROM employee
                JOIN role
                     ON employee.role_id = role.id
                JOIN department
                     ON department.id = role.departments_id
                WHERE departments.id = ?`
    
    connection.query(query, res.department,(err,res) => {
    if(err) throw err;
       firstPrompt();
       console.table(res);
      });
    })
}

// ADD AN EMPLOYEE
function addEmployee() {
    let query =
    `SELECT
        role.id,
        role.title,
        role.salary
    FROM role`

connection.query(query,(err, res) => {
    if(err) throw err;
    const role = res.map(({ id, title, salary }) => ({
        value: id,
        title: `${title}`,
        salary: `${salary}`
    }));

    console.table(res);
    employeesRoles(role);
   });
}

function employeesRoles(role) {
    inquirer
    .prompt([
        {
            type:'input',
            name:'firstName',
            message:'Employees First Name: '
        },
        {
            type:'input',
            name:'lastName',
            message:'Employee Last Name: ',
        },
        {
            type:'list',
            name:'roleId',
            message:'Employee Role: ',
            choices: role
        }
    ]).then((res) => {
        let query = 'INSERT INTO employee SET ?'
        connection.query(query, {
            first_name: res.firsName,
            last_name: res.lastName,
            role_id: res.roleId
    },(err, res) => {
        if(err) throw err;
        firstPrompt();
        });
    });
}

//REMOVE EMPLOYEE
function removeEmployee() {
    let query =
    `SELECT
         employee.id,
         employee.first_name,
         employee.last_name,
    FROM employee`

    connection.query(query,(err, res) => {
        if(err) throw err;
        const employee = res.map(({ id, first_name, last_name }) => ({
            value: id,
            name: `${id} ${first_name} ${last_name}`
        }));
        console.table(res);
        getDelete(employee);
    });
}

function getDelete(employee){
    inquirer
    .prompt([
        {
            type:'list',
            name:'employee',
            message:'Employee To Be Deleted: ',
            choices: employee
        }
    ]).then((res) => {
        let query = `DELETE FROM employee WHERE ?`;
        connection.query(query, { id: res.employee }, (err, res) => {
            if(err) throw err;
            firstPrompt();
        });
    });
}

function updateEmployeeRole() {
    let query = `SELECT 
                     employee.id,
                     employee.first_name,
                     employee.last_name,
                     role.title,
                     department.name,
                     role.salary,
                     CONCAT(manager.first_name,'', manager.last_name) AS manager
                FROM employee
                JOIN role
                     ON employee.role_id = role.id
                JOIN department
                     ON department.id = role.department_id
                JOIN employee manager
                     ON manager.id = employee.manager_id`
    connection.query(query,(err, res) => {
        if(err) throw err;
        const employee = res.map(({ id, first_name, last_name }) => ({
            value: id,
            name: `${first_name} ${last_name}`
        }));
        console.table(res);
        updateRole(employee);
    });
}

function updateRole(employee) {
    let query =
    `SELECT
       role.id,
       role.title,
       role.salary
    FROM role`

    connection.query(query,(err, res) => {
        if(err) throw err;
        let roleChoices = res.map(({ id, title, salary }) => ({
            value: id,
            title: `${title}`,
            salary: `${salary}`
        }));
        console.table(res);
        getUpdatedRole(employee, roleChoices);
    });
}

function getUpdatedRole(employee, roleChoices) {
    inquirer
    .prompt([
        {
            type:'list',
            name:'employee',
            message:`Employee whos role will be updated: `,
            choices: employee
        },
        {
            type:'list',
            name:'role',
            message:'Select New Role: ',
            choices: roleChoices
        },
    ]).then((res) => {
        let query = `UPDATE employee SET role_id = WHERE id = ?`
        connection.query(query,[ res.role, res.employee],(err, res) => {
            if(err) throw err;
            firstPrompt();
        });
    });
}

//ADD ROLE
function addRole() {
    var query = 
    `SELECT
      department.id,
      department.name,
      role.salary,
    FROM employee
    JOIN role
       ON employee.role_id = role.id
    GROUP BY department.id, department.name`

    connection.query(query,(err, res) => {
        if(err) throw err;
        const department = res.map(({ id, name}) => ({
            value: id,
            name: `${id} ${name}`
        }));
        console.table(res);
        addToRole(department);
    });
}

function addToRole(department) {
    inquirer
    .prompt([
        {
            type:'input',
            name:'title',
            message:'Role title: '
        },
        {
            type:'list',
            name:'salary',
            message:'Role Salary: '
        },
        {
            type:'list',
            name:'department',
            message:'Department: ',
            choices: department
        },
    ]).then((res) => {
        let query = `INSERT INTO role SET ?`;

        connection.query(query, {
            title: res.title,
            salary: res.salary,
            department_id: res.department
        },(err, res) => {
            if(err) throw err;
            firstPrompt();
        });
    });
}

//ADD DEPARTMENT 
function addDepartment() {
    inquirer
    .prompt([
        {
            type:'input',
            name:'name',
            message:'Department Name: '
        }
    ]).then((res) => {
    let query = `INSERT INTO department SET ?`;
    connection.query(query, {name: res.name},(err, res) => {
        if(err) throw err;
        //console.log(res);
        firstPrompt();
      });
    });
};