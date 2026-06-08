import mongoose from "mongoose";
import { APPOINTMENT_STATUS, SERVICE_TYPES } from "../config/constants.js";

const appointmentSchema = new mongoose.Schema(
    {
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        assignedTechnician: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        serviceType: {
            type: String,
            enum: Object.values(SERVICE_TYPES),
            required: true,
        },
        description: {
            type: String,
            required: [true, "Appointment description is required"],
            trim: true,
        },
        scheduledDate: {
            type: Date,
            required: [true, "Scheduled date is required"],
        },
        scheduledTime: {
            type: String,
            required: [true, "Scheduled time is required"],
        },
        location: {
            type: String,
            enum: ["on_site", "drop_off"],
            default: "drop_off",
        },
        address: {
            street: String,
            city: String,
            region: String,
        },
        status: {
            type: String,
            enum: Object.values(APPOINTMENT_STATUS),
            default: APPOINTMENT_STATUS.PENDING,
        },
        estimatedDurationHours: Number,
        notes: String,
    },
    { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);