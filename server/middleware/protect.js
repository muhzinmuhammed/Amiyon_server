import jwt from "jsonwebtoken";
import mysqlPool from "../config/db.js";
import * as dotenv from "dotenv";

dotenv.config();

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

   // Extract token from headers
  const JWT_SECRET = process.env.JWT_SECRET;

  if (token) {
    try {
      // Verify the JWT token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      const adminId = decoded.user_id; // Assuming `user_id` is the payload key for admin ID in the token

      // Fetch the admin user from the database
      const [result] = await mysqlPool.execute(
        "SELECT * FROM admin WHERE id = ?",
        [adminId]
      );

      if (result.length > 0) {
        req.user = result[0]; // Attach the admin user data to `req.user`
        next(); // Proceed to the next middleware
      } else {
        res.status(404).json({ error: "Admin not found" });
      }
    } catch (error) {
      // Handle token verification errors
      if (error.name === "TokenExpiredError") {
        res.status(401).json({ error: "Token expired" });
      } else {
        res.status(401).json({ error: "Not authorized, invalid token" });
      }
    }
  } else {
    // No token was provided in headers
    res.status(401).json({ error: "No token provided" });
  }
};

export { protect };
