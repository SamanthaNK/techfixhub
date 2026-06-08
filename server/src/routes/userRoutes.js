import express from "express";
import { body } from "express-validator";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.put(
    "/profile",
    protect,
    [
        body("firstName").optional().trim().notEmpty(),
        body("lastName").optional().trim().notEmpty(),
        body("phone")
            .optional()
            .matches(/^(\+237|237)?[6-9][0-9]{8}$/)
            .withMessage("Valid Cameroon phone number required"),
    ],
    validate,
    async (req, res) => {
        try {
            const allowedFields = ["firstName", "lastName", "phone", "address"];
            const updates = {};
            allowedFields.forEach((field) => {
                if (req.body[field] !== undefined) updates[field] = req.body[field];
            });

            const user = await User.findByIdAndUpdate(req.user._id, updates, {
                new: true,
                runValidators: true,
            });

            res.status(200).json({ success: true, data: user });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
);

router.put(
    "/change-password",
    protect,
    [
        body("currentPassword").notEmpty().withMessage("Current password is required"),
        body("newPassword")
            .isLength({ min: 8 })
            .withMessage("New password must be at least 8 characters"),
    ],
    validate,
    async (req, res) => {
        try {
            const user = await User.findById(req.user._id).select("+password");

            const isMatch = await user.matchPassword(req.body.currentPassword);
            if (!isMatch) {
                return res
                    .status(401)
                    .json({ success: false, message: "Current password is incorrect" });
            }

            user.password = req.body.newPassword;
            await user.save();

            res
                .status(200)
                .json({ success: true, message: "Password updated successfully" });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
);

export default router;