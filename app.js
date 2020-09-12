var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "Salsirap200.",
  database: "onensi"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected as id: "+connection.threadId)
  main();
});

function main(){
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: [
                "View Employees",
                "View Departments",
                "View Roles",
                "Add Employee",
                "Add Department",
                "Add Role",
                "Update employee roles",
                "End"
            ]
        }
    ]).then(function(answer){
        switch(answer.action){
            case "View Employees": 
                viewEmployees();
                break;

            case "View Departments": 
                viewDepartments();
                break;

            case "View Roles": 
                viewRoles();
                break;
            
            case "Add Employee": 
                addEmployee();
                break;

            case "Add Department": 
                addDepartment();
                break;
            
            case "Add Role": 
                addRole();
                break;
            
            case "Update employee roles":
                updateRole();
                break;

            case "End":
                connection.end();
                break;
        }
    });

    function viewEmployees(){
        var query = "select * from employee";
        connection.query(query, function(err,res){
            console.table(res);
            main();
        });
    }

    function viewDepartments(){
        var query = "select * from department";
        connection.query(query, function(err,res){
            console.table(res);
            main();
        });
    }

    function viewRoles(){
        var query = "select * from role";
        connection.query(query, function(err,res){
            console.table(res);
            main();
        });
    }

    function addEmployee(){
        inquirer.prompt([
            {
                type: "input",
                name: "fName",
                message: "Enter employee first name: "
            },

            {
                type: "input",
                name: "lName",
                message: "Enter employee last name: "
            },

            {
                type: "number",
                name: "roleId",
                message: "What is the employee's role ID: "
            },

            {
                type: "number",
                name: "manId",
                message: "What is the manager ID of employee: "
            }
        ]).then(function(res){
            console.log(res)
            let query="insert into employee(first_name, last_name, role_id, manager_id) values(?,?,?,?)";
            connection.query(query, [res.fName, res.lName, res.roleId, res.manId], function(err,data){
                if(err) throw err;
                console.log("Success");
                main();
            })
        });
    }

    function addDepartment(){
        inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: "Enter name of new department"
            }
        ]).then(function(res){
            let query = "insert into department (name) values (?)"
            connection.query(query, [res.name], (err,data)=>{
                if(err) throw err;
                console.log("Success");
                main();
            })
        })  
    }

    function addRole(){
        inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "Enter title of the role"
            },

            {
                type: "number",
                name: "salary",
                message: "What is the salary of this role?"
            },

            {
                type: "number",
                name: "depId",
                message: "What is the department ID of the role?"
            }

        ]).then((res)=>{
            let query = "insert into role (title, salary, department_id) values(?,?,?)"
            connection.query(query, [res.title, res.salary, res.depId], (err,data)=>{
                if(err) throw err;
                console.log("Success");
                main();
            })
        })
    }

    function updateRole(){
        connection.query('select * from employee', function(err,res){
            if (err) throw err
            const list = res.map(({id, first_name, last_name})=>({
                value: id,
                name: `${id} ${first_name} ${last_name}`
            }))
            console.table(res)

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: `First name of employee you would like to update?`,
                },

                {
                    type: 'number',
                    name: 'newRole',
                    message: 'Enter new role ID:'
                }
            ]).then((res)=>{
                let query = 'update employee set role_id=? where first_name=?';
                connection.query(query, [res.newRole, res.first_name], (err, res)=>{
                    if(err) throw err;
                    console.log("Success")
                    console.table(res)
                    main();
                })
            });
        })
    }
}