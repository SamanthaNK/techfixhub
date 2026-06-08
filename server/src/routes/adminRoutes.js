import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { USER_ROLES } from "../config/constants.js";
import User from "../models/User.js";
import RepairRequest from "../models/RepairRequest.js";
import TrainingProgram from "../models/TrainingProgram.js";
import Enrollment from "../models/Enrollment.js";
import ContactMessage from "../models/ContactMessage.js";
import Appointment from "../models/Appointment.js";

const router = express.Router();

router.use(protect);
router.use(authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN));

router.get("/dashboard", async (req, res) => {
    try {
        const [
            totalUsers,
            totalRepairs,
            pendingRepairs,
            totalPrograms,
            totalEnrollments,
            unreadMessages,
            pendingAppointments,
        ] = await Promise.all([
            User.countDocuments({ role: USER_ROLES.CUSTOMER }),
            RepairRequest.countDocuments(),
            RepairRequest.countDocuments({ status: "pending" }),
            TrainingProgram.countDocuments({ isActive: true }),
            Enrollment.countDocuments(),
            ContactMessage.countDocuments({ isRead: false }),
            Appointment.countDocuments({ status: "pending" }),
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalRepairs,
                pendingRepairs,
                totalPrograms,
                totalEnrollments,
                unreadMessages,
                pendingAppointments,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get("/users", async (req, res) => {
    try {
        const { role, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (role) filter.role = role;

        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
            User.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            count: users.length,
            total,
            data: users,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.patch("/users/:id/toggle-status", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        user.isActive = !user.isActive;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            message: `User ${user.isActive ? "activated" : "deactivated"}`,
            data: { id: user._id, isActive: user.isActive },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.patch("/users/:id/role", async (req, res) => {
    try {
        const { role } = req.body;

        if (!Object.values(USER_ROLES).includes(role)) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid role" });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        );

        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;