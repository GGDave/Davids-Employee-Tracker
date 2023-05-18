INSERT INTO departments (department_name)
VALUES 
('Engine building'),
('Exhaust systems'),
('Suspension'),
('Brake systems'),
('Transmission'),
('Fuel System'),
('Performance tuning'),
('Custom fabrication'),
('Alignment services'),
('Accessories');

-- Roles table
INSERT INTO roles (title, salary, department_id) VALUES
('Engine Building Technician', 100000.00, 1),
('Custom Fabrication Technician', 90000.00, 2),
('Transmission Technician', 80000.00, 3),
('Performance Tuning Technician', 70000.00, 4),
('Fuel System Technician', 60000.00, 5),
('Suspension Technician', 59000.00, 6),
('Alignment Technician', 56000.00, 7),
('Exhaust Systems Technician',53000.00 , 8),
('Brake Systems Technician', 52000.00, 9),
('Accessories Technician', 51000.00, 10);


-- Names table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Madison', 'Kim', 1, 1),
('William', 'Singh', 2, 2),
('Emma', 'Nguyen', 3, 3),
('Jacob', 'Lee', 4, 4),
('Olivia', 'Patel', 5, 5),
('Michael', 'Chang', 6, 6),
('Sophia', 'Khan', 7, 7),
('Ethan', 'Rodriguez', 8, 8),
('Ava', 'Martinez', 9, 9),
('Benjamin', 'Kimura', 10, 10);