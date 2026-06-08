import express from "express";
import {
    getPrograms,
    getProgramById,
    enrollInProgram,
    getMyEnrollments,
    createProgram,
    updateProgram,
} from "../controllers/trainingController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { USER_ROLES } from "../config/constants.js";

const router = express.Router();

router.get("/", getPrograms);
router.get("/my-enrollments", protect, getMyEnrollments);
router.get("/:id", getProgramById);
router.post("/:id/enroll", protect, enrollInProgram);

router.post(
    "/",
    protect,
    authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    createProgram
);
router.put(
    "/:id",
    protect,
    authorize(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    updateProgram
);

export default router;