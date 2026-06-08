import express from "express";
import { body } from "express-validator";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import { USER_ROLES, SERVICE_TYPES } from "../config/constants.js";
import Appointment from "../models/Appointment.js";

const router = express.Router();

router.post(
    "/",
    protect,
    [
        body("serviceType")
            .isIn(Object.values(SERVICE_TYPES))
            .withMessage("Invalid service type"),
        body("description").trim().notEmpty().withMessage("Description is required"),
        body("scheduledDate").isISO8601().withMessage("Valid date is required"),
        body("scheduledTime").notEmpty().withMessage("Scheduled time is required"),
    ],
    validate,
    async (req, res) => {
        try {
            const appointment = await Appointment.create({
                ...req.body,
                client: req.user._id,
            });
            res.status(201).json({
                success: true,
                message: "Appointment booked. We will confirm shortly.",
                data: appointment,
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
);

router.get("/my-appointments", protect, async (req, res) => {
    try {
        const appointments = await Appointment.find({ client: req.user._id })
            .sort({ scheduledDate: 1 })
            .populate("assignedTechnician", "firstName lastName");
        res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get(
    "/",
    protect,
    authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.TECHNICIAN),
    async (req, res) => {
        try {
            const appointments = await Appointment.find()
                .sort({ scheduledDate: 1 })
                .populate("client", "firstName lastName phone")
                .populate("assignedTechnician", "firstName lastName");
            res.status(200).json({
                success: true,
                count: appointments.length,
                data: appointments,
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
);

router.patch(
    "/:id/status",
    protect,
    authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.TECHNICIAN),
    async (req, res) => {
        try {
            const appointment = await Appointment.findByIdAndUpdate(
                req.params.id,
                { status: req.body.status, assignedTechnician: req.body.assignedTechnician },
                { new: true, runValidators: true }
            );
            if (!appointment) {
                return res
                    .status(404)
                    .json({ success: false, message: "Appointment not found" });
            }
            res.status(200).json({ success: true, data: appointment });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
);

export default router;