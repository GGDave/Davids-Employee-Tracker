SELECT d.department_name, r.title, r.salary 
FROM employee e 
JOIN roles r 
ON e.role_id = r.id 
JOIN departments d 
ON r.department_id = d.id;