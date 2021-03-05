drop database if exists employee_tracker;
create database employee_tracker;

use employee_tracker;

create table department (
    id int,
    name varchar(30),
    primary key (id)
);

create table 'role' (
    id int,
    title varchar(30),
    salary decimal,
    department_id int,
    primary key (id)
); 

create table employee (
    id int,
    first_name varchar(30),
    last_name varchar(30), 
    role_id int,
    manager_id int,
    primary key (id)
);