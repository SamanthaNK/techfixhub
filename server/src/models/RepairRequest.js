import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { REPAIR_STATUS, DEVICE_CATEGORIES } from "../config/constants.js";

const statusUpdateSchema = new mongoose.Schema(
    {
        status: {
            type: String,
            enum: Object.values(REPAIR_STATUS),
            required: true,
        },
        note: { type: String, trim: true },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

const repairRequestSchema = new mongoose.Schema(
    {
        trackingId: {
            type: String,
            unique: true,
            default: () => `TFH-${uuidv4().split("-")[0].toUpperCase()}`,
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        assignedTechnician: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        deviceCategory: {
            type: String,
            enum: Object.values(DEVICE_CATEGORIES),
            required: [true, "Device category is required"],
        },
        deviceBrand: {
            type: String,
            required: [true, "Device brand is required"],
            trim: true,
        },
        deviceModel: {
            type: String,
            trim: true,
        },
        issueDescription: {
            type: String,
            required: [true, "Issue description is required"],
            trim: true,
            maxlength: [1000, "Issue description cannot exceed 1000 characters"],
        },
        deviceImages: [{ type: String }],
        status: {
            type: String,
            enum: Object.values(REPAIR_STATUS),
            default: REPAIR_STATUS.PENDING,
        },
        statusHistory: [statusUpdateSchema],
        diagnosisNotes: {
            type: String,
            trim: true,
        },
        estimatedCost: {
            type: Number,
            min: 0,
        },
        finalCost: {
            type: Number,
            min: 0,
        },
        currency: {
            type: String,
            default: "FCFA",
        },
        estimatedCompletionDate: Date,
        completedAt: Date,
        customerApprovedQuote: {
            type: Boolean,
            default: null,
        },
        priority: {
            type: String,
            enum: ["low", "normal", "high", "urgent"],
            default: "normal",
        },
        warrantyDays: {
            type: Number,
            default: 30,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

repairRequestSchema.pre("save", function () {
    if (this.isModified("status")) {
        this.statusHistory.push({ status: this.status });
    }
});

export default mongoose.model("RepairRequest", repairRequestSchema);