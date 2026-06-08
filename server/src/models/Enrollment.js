import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        program: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TrainingProgram",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "in_progress", "completed", "cancelled"],
            default: "pending",
        },
        paymentStatus: {
            type: String,
            enum: ["unpaid", "partial", "paid"],
            default: "unpaid",
        },
        amountPaidFCFA: {
            type: Number,
            default: 0,
        },
        enrollmentDate: {
            type: Date,
            default: Date.now,
        },
        completionDate: Date,
        notes: String,
    },
    { timestamps: true }
);

enrollmentSchema.index({ student: 1, program: 1 }, { unique: true });

export default mongoose.model("Enrollment", enrollmentSchema);