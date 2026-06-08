import express from "express";
import { body } from "express-validator";
import {
    register,
    login,
    getMe,
    forgotPassword,
    resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post(
    "/register",
    [
        body("firstName").trim().notEmpty().withMessage("First name is required"),
        body("lastName").trim().notEmpty().withMessage("Last name is required"),
        body("email").isEmail().withMessage("Valid email is required"),
        body("phone")
            .matches(/^(\+237|237)?[6-9][0-9]{8}$/)
            .withMessage("Valid phone number required"),
        body("password")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters"),
    ],
    validate,
    register
);

router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Valid email is required"),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    validate,
    login
);

router.get("/me", protect, getMe);

router.post(
    "/forgot-password",
    [body("email").isEmail().withMessage("Valid email is required")],
    validate,
    forgotPassword
);

router.put(
    "/reset-password/:token",
    [
        body("password")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters"),
    ],
    validate,
    resetPassword
);

export default router;