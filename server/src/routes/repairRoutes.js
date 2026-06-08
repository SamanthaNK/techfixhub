import express from "express";
import { body } from "express-validator";
import {
    submitRepairRequest,
    trackRepair,
    getMyRepairs,
    getRepairById,
    updateRepairStatus,
    getAllRepairs,
} from "../controllers/repairController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import { USER_ROLES, DEVICE_CATEGORIES, REPAIR_STATUS } from
    "../config/constants.js";

const router = express.Router();

router.get("/track/:trackingId", trackRepair);

router.post(
    "/",
    protect,
    [
        body("deviceCategory")
            .isIn(Object.values(DEVICE_CATEGORIES))
            .withMessage("Invalid device category"),
        body("deviceBrand").trim().notEmpty().withMessage("Device brand is required"),
        body("issueDescription")
            .trim()
            .isLength({ min: 10 })
            .withMessage("Please describe the issue (min 10 characters)"),
    ],
    validate,
    submitRepairRequest
);

router.get("/my-repairs", protect, getMyRepairs);
router.get("/:id", protect, getRepairById);

router.get(
    "/",
    protect,
    authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.TECHNICIAN),
    getAllRepairs
);

router.patch(
    "/:id/status",
    protect,
    authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.TECHNICIAN),
    [
        body("status")
            .isIn(Object.values(REPAIR_STATUS))
            .withMessage("Invalid status value"),
    ],
    validate,
    updateRepairStatus
);

export default router;