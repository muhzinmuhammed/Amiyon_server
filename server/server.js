import express from "express";
import cors from "cors";
import morgan from "morgan";
import companyRoute from './router/companyRouter.js'
import employeeRoute from './router/employeeRouter.js'
import adminRoute from './router/adminAuthRouter.js'
const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/company", companyRoute);
app.use("/api/v2/employee", employeeRoute);
app.use('/api/v3/admin',adminRoute)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});