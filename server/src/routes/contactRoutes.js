import express from "express";
import { body } from "express-validator";
import {
    submitContactMessage,
    getContactMessages,
    markAsRead,
} from "../controllers/contactController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import { USER_ROLES } from "../config/constants.js";

const router = express.Router();

router.post(
    "/",
    [
        body("fullName").trim().notEmpty().withMessage("Full name is required"),
        body("email").isEmail().withMessage("Valid email is required"),
        body("subject")
            .isIn([
                "repair_inquiry",
                "maintenance_inquiry",
                "training_inquiry",
                "quotation",
                "general",
                "complaint",
            ])
            .withMessage("Invalid subject"),
        body("message")
            .trim()
            .isLength({ min: 10 })
            .withMessage("Message must be at least 10 characters"),
    ],
    validate,
    submitContactMessage
);

router.get(
    "/",
    protect,
    authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    getContactMessages
);

router.patch(
    "/:id/read",
    protect,
    authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    markAsRead
);

export default router;