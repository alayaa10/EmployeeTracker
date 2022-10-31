USE employeeTracker_DB;


INSERT INTO department (name)
VALUES ("Engineering");

INSERT INTO department (name)
VALUES ("Sales");

INSERT INTO department (name)
VALUES ("Analyst");

INSERT INTO department (name)
VALUES ("Finance");


INSERT INTO role (title, salary, department_id)
VALUES ("Software Engingeer", 80000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Insurance Sales", 60000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Data Analyst", 70000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 65000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Alaya","Guxj", 10);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Dj","Reyes", 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Rey","Evans", 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Gully","Zam", 3);