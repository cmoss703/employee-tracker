drop database if exists employeetrackerdb;
create database employeetrackerdb;

use employeetrackerdb;

create table department (
    id int not null auto_increment,
    name varchar(30),
    primary key (id)
);

create table roles (
    id int not null auto_increment,
    title varchar(30),
    salary decimal,
    department_id int,
    primary key (id)
); 

create table employee (
    id int not null auto_increment,
    first_name varchar(30),
    last_name varchar(30), 
    roles_id int,
    manager_id int,
    primary key (id)
);