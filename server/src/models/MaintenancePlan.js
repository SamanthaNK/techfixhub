import mongoose from "mongoose";
import { MAINTENANCE_PLAN_TARGETS } from "../config/constants.js";

const maintenancePlanSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Plan name is required"],
            trim: true,
        },
        targetSector: {
            type: String,
            enum: Object.values(MAINTENANCE_PLAN_TARGETS),
            required: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        features: [{ type: String }],
        priceMonthly: {
            type: Number,
            required: true,
            min: 0,
        },
        priceAnnual: {
            type: Number,
            min: 0,
        },
        currency: {
            type: String,
            default: "FCFA",
        },
        maxDevices: {
            type: Number,
            required: true,
        },
        responseTimeHours: {
            type: Number,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("MaintenancePlan", maintenancePlanSchema);