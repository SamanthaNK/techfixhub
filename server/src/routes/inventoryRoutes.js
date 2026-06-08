import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { USER_ROLES } from "../config/constants.js";
import Inventory from "../models/Inventory.js";

const router = express.Router();

router.use(protect);
router.use(authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.TECHNICIAN));

router.get("/", async (req, res) => {
    try {
        const { category, lowStock } = req.query;
        const filter = { isActive: true };

        if (category) filter.category = category;

        const items = await Inventory.find(filter).sort({ name: 1 });

        const result = lowStock === "true"
            ? items.filter((i) => i.quantity <= i.lowStockThreshold)
            : items;

        res.status(200).json({ success: true, count: result.length, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const item = await Inventory.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!item) {
            return res
                .status(404)
                .json({ success: false, message: "Inventory item not found" });
        }
        res.status(200).json({ success: true, data: item });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.patch("/:id/stock", async (req, res) => {
    try {
        const { adjustment } = req.body;
        const item = await Inventory.findById(req.params.id);

        if (!item) {
            return res
                .status(404)
                .json({ success: false, message: "Inventory item not found" });
        }

        const newQuantity = item.quantity + adjustment;
        if (newQuantity < 0) {
            return res
                .status(400)
                .json({ success: false, message: "Insufficient stock" });
        }

        item.quantity = newQuantity;
        await item.save();

        res.status(200).json({ success: true, data: item });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;