USE employeetrackerdb;

INSERT INTO department (name)
VALUES ("Admin"), ("Design"), ("Engineering");

INSERT INTO roles (title, salary, department_id)
VALUES ("Manager", 65000, 1), ("Marketing", 45000, 1), ("Designer", 50000, 2), ("Architect", 70000, 2), ("Senior Engineer", 80000, 3), ("Intern Engineer", 55000, 3);

INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUES ("Janelle", "Monae", 1, null), ("Lemon", "Verbena", 2, 1), ("Christina", "Moss", 1, null), ("Demi", "Doge", 3, 2), ("Joseph", "Lynn", 4, 2), ("Timothee", "Trust", 5, 1), ("Willow", "Rosenberg", 6, 2), ("Vickie", "Moss", 3, 1);
