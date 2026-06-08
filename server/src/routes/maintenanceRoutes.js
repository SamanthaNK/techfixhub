import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { USER_ROLES } from "../config/constants.js";
import MaintenancePlan from "../models/MaintenancePlan.js";
import MaintenanceContract from "../models/MaintenanceContract.js";

const router = express.Router();

router.get("/plans", async (req, res) => {
    try {
        const plans = await MaintenancePlan.find({ isActive: true }).sort({ priceMonthly: 1 });
        res.status(200).json({ success: true, data: plans });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post(
    "/plans",
    protect,
    authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    async (req, res) => {
        try {
            const plan = await MaintenancePlan.create(req.body);
            res.status(201).json({ success: true, data: plan });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
);

router.get("/contracts/mine", protect, async (req, res) => {
    try {
        const contracts = await MaintenanceContract.find({ client: req.user._id })
            .populate("plan", "name targetSector priceMonthly")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: contracts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get(
    "/contracts",
    protect,
    authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    async (req, res) => {
        try {
            const contracts = await MaintenanceContract.find()
                .populate("client", "firstName lastName email")
                .populate("plan", "name targetSector")
                .sort({ createdAt: -1 });
            res.status(200).json({ success: true, count: contracts.length, data: contracts });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
);

router.post(
    "/contracts",
    protect,
    authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    async (req, res) => {
        try {
            const contract = await MaintenanceContract.create(req.body);
            res.status(201).json({ success: true, data: contract });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
);

export default router;