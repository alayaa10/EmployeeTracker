DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;
USE employees_db;

CREATE TABLE departments (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
   title VARCHAR(45) NULL,
   salary DECIMAL(10.3) NULL,
   department_id INT NULL,
   PRIMARY KEY (ID)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(45) NULL,
    last_name VARCHAR(45) NULL,
    role_id INT NULL,
    manager_id INT NULL,
    PRIMARY KEY (ID)
);