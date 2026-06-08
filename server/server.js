const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");

const { errorHandler, notFound } = require("./src/middleware/errorMiddleware");

const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const repairRoutes = require("./src/routes/repairRoutes");
const maintenanceRoutes = require("./src/routes/maintenanceRoutes");
const trainingRoutes = require("./src/routes/trainingRoutes");
const appointmentRoutes = require("./src/routes/appointmentRoutes");
const contactRoutes = require("./src/routes/contactRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const inventoryRoutes = require("./src/routes/inventoryRoutes");

const app = express();

app.use(helmet());

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 200,
        message: { success: false, message: "Too many requests. Please try again later." },
    })
);

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { success: false, message: "Too many login attempts. Please try again in 15 minutes." },
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "TechFix Hub API is running",
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/repairs", repairRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/training", trainingRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/inventory", inventoryRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => {
            console.log(`TechFix Hub API running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    });