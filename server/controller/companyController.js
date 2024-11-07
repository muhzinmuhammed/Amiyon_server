import mysqlPool from "../config/db.js";
import { v4 as uuidv4 } from "uuid"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebaseConfig.js";
// Create: Add a new company
const addCompany = async (req, res) => {
    const { name, email,  website } = req.body;


    try {
        // Check if the company already exists by email
        const [existingCompany] = await mysqlPool.execute(
            'SELECT * FROM company WHERE email = ?',
            [email]
        );

        if (existingCompany.length > 0) {
            return res.status(400).json({ message: 'Company with this email already exists.' });
        }
        const imageUrls = [];
        for (const file of req.files) {
            console.log(file,"kil");
            
            const imageRef = ref(storage, `company/${uuidv4()}-${file.originalname}`);
            await uploadBytes(imageRef, file.buffer);
            const imageUrl = await getDownloadURL(imageRef);
            imageUrls.push(imageUrl);
        }
        // Check if images are provided
        if (!req.files || req.files.length == 0) {
            return res.status(400).json({ message: "Please upload at least one image" });
        }
        const logo = imageUrls[0];
        // Insert new company
        const [result] = await mysqlPool.execute(
            'INSERT INTO company (name, email, logo, website) VALUES (?, ?, ?, ?)',
            [name, email, logo, website]
        );

        return res.status(201).json({
            message: 'Company added successfully!',
            
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to add company', error: error.message });
    }
};

// Read: Get all companies
const getAllCompanies = async (req, res) => {
    try {
        const [companies] = await mysqlPool.execute('SELECT * FROM company');
        return res.status(200).json({data:companies});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to retrieve companies', error: error.message });
    }
};

// Read: Get a company by ID
const getCompanyById = async (req, res) => {
    const { id } = req.params;

    try {
        const [company] = await mysqlPool.execute('SELECT * FROM company WHERE id = ?', [id]);

        if (company.length === 0) {
            return res.status(404).json({ message: 'Company not found' });
        }

        return res.status(200).json(company[0]);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to retrieve company', error: error.message });
    }
};

// Update: Update a company by ID
const updateCompany = async (req, res) => {
    const { id } = req.params;
    const { name, email, website } = req.body;

    try {
        // Check if the company exists
        const [existingCompany] = await mysqlPool.execute(
            'SELECT * FROM company WHERE id = ?',
            [id]
        );

        if (existingCompany.length === 0) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Prepare the update query with only the fields that are provided
        let updateFields = [];
        let updateValues = [];

        if (name) {
            updateFields.push('name = ?');
            updateValues.push(name);
        }
        if (email) {
            updateFields.push('email = ?');
            updateValues.push(email);
        }
        if (website) {
            updateFields.push('website = ?');
            updateValues.push(website);
        }

        // Handle logo update if a new image file is uploaded
        if (req.files && req.files.length > 0) {
            const file = req.files[0]; // Assuming only one logo file is uploaded
            const imageRef = ref(storage, `company/${uuidv4()}-${file.originalname}`);
            await uploadBytes(imageRef, file.buffer);
            const logoUrl = await getDownloadURL(imageRef);

            updateFields.push('logo = ?');
            updateValues.push(logoUrl);
        }

        // If no fields to update, return an error
        if (updateFields.length === 0) {
            return res.status(400).json({ message: 'No fields provided for update' });
        }

        // Append the ID for the WHERE clause
        updateValues.push(id);

        // Build the update query
        const updateQuery = `UPDATE company SET ${updateFields.join(', ')} WHERE id = ?`;

        // Execute the update query
        const [result] = await mysqlPool.execute(updateQuery, updateValues);

        return res.status(200).json({
            message: 'Company updated successfully!',
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to update company', error: error.message });
    }
};



// Delete: Delete a company by ID
const deleteCompany = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the company exists
        const [existingCompany] = await mysqlPool.execute(
            'SELECT * FROM company WHERE id = ?',
            [id]
        );

        if (existingCompany.length === 0) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Delete company
        const [result] = await mysqlPool.execute('DELETE FROM company WHERE id = ?', [id]);

        return res.status(200).json({
            message: 'Company deleted successfully!',
            
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to delete company', error: error.message });
    }
};

// Export all functions
export { addCompany, getAllCompanies, getCompanyById, updateCompany, deleteCompany };
