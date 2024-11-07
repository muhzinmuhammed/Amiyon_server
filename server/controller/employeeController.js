import mysqlPool from '../config/db.js'

//add employee

const addEmployee = async (req, res) => {
    const { firstname, lastname, company_id, email, phone } = req.body;
console.log(req.body);

    try {
        // Check if the employee already exists by email
        const [existingEmployee] = await mysqlPool.execute(
            'SELECT * FROM employee WHERE email = ?',
            [email]
        );

        if (existingEmployee.length > 0) {
            return res.status(400).json({ message: 'Employee with this email already exists.' });
        }

        // Insert new employee
        const [result] = await mysqlPool.execute(
            'INSERT INTO employee (firstname, lastname, company_id, email, phone) VALUES (?, ?, ?, ?, ?)',
            [firstname, lastname, company_id, email, phone]
        );

        return res.status(201).json({
            message: 'Employee added successfully!',
            employeeId: result.insertId
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Failed to add employee', error: error.message });
    }
};

//all company

const getAllCompanies = async (req, res) => {
    try {
        const [companies] = await mysqlPool.execute('SELECT * FROM company');
        return res.status(200).json({data:companies});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to retrieve companies', error: error.message });
    }
};

//get  Employees by id
const getAllEmployees = async (req, res) => {
    try {
        const [employees] = await mysqlPool.execute(`
            SELECT employee.*, company.name AS company_name
            FROM employee
            INNER JOIN company ON employee.company_id = company.id
        `);
        return res.status(200).json({ data:employees });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to fetch employees', error: error.message });
    }
};


// Get Employee by ID
const getEmployeeById = async (req, res) => {
    const { id } = req.params;

    try {
        const [employee] = await mysqlPool.execute('SELECT * FROM employee WHERE id = ?', [id]);

        if (employee.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        return res.status(200).json({ employee: employee[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to fetch employee', error: error.message });
    }
};


// Update Employee
const updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, company_id, email, phone } = req.body;
    console.log(req.body);
    

    try {
        // Check if the employee exists
        const [existingEmployee] = await mysqlPool.execute('SELECT * FROM employee WHERE id = ?', [id]);

        if (existingEmployee.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Prepare the update query with only the fields provided
        let updateFields = [];
        let updateValues = [];

        if (firstname) {
            updateFields.push('firstname = ?');
            updateValues.push(firstname);
        }
        if (lastname) {
            updateFields.push('lastname = ?');
            updateValues.push(lastname);
        }
        if (company_id) {
            updateFields.push('company_id = ?');
            updateValues.push(company_id);
        }
        if (email) {
            updateFields.push('email = ?');
            updateValues.push(email);
        }
        if (phone) {
            updateFields.push('phone = ?');
            updateValues.push(phone);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ message: 'No fields provided for update' });
        }

        // Append the ID for the WHERE clause
        updateValues.push(id);

        // Build the update query
        const updateQuery = `UPDATE employee SET ${updateFields.join(', ')} WHERE id = ?`;

        // Execute the update query
        const [result] = await mysqlPool.execute(updateQuery, updateValues);

        return res.status(200).json({
            message: 'Employee updated successfully!',
            affectedRows: result.affectedRows
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to update employee', error: error.message });
    }
};


// Delete Employee
const deleteEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the employee exists
        const [existingEmployee] = await mysqlPool.execute('SELECT * FROM employee WHERE id = ?', [id]);

        if (existingEmployee.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Delete the employee
        const [result] = await mysqlPool.execute('DELETE FROM employee WHERE id = ?', [id]);

        return res.status(200).json({
            message: 'Employee deleted successfully!',
            affectedRows: result.affectedRows
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to delete employee', error: error.message });
    }
};

export {addEmployee,getAllEmployees,getEmployeeById,updateEmployee,deleteEmployee,getAllCompanies}