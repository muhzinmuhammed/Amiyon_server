import mysqlPool from "../config/db.js";
import generateToken from "../utils/genarteToken.js";

// Admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the admin exists
        const [result] = await mysqlPool.execute(
            'SELECT * FROM admin WHERE email = ?',
            [email]
        );

        if (result.length === 0) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const admin = result[0];
        console.log(admin);
        

        // Compare the passwords (for security, consider hashing passwords in production)
        if (admin.password !== password) {
            return res.status(401).json({ message: "Invalid email or password." });
        }
        const token = generateToken(admin.id);
        // Login successful
        return res.status(200).json({ message: "Login successful",
              _id: admin.id,
           
           
            email: admin.email,
           
            token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Login failed", error: error.message });
    }
};

export { adminLogin };
