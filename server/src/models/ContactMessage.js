import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        subject: {
            type: String,
            required: [true, "Subject is required"],
            enum: [
                "repair_inquiry",
                "maintenance_inquiry",
                "training_inquiry",
                "quotation",
                "general",
                "complaint",
            ],
        },
        message: {
            type: String,
            required: [true, "Message is required"],
            maxlength: [2000, "Message cannot exceed 2000 characters"],
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        isResolved: {
            type: Boolean,
            default: false,
        },
        respondedAt: Date,
    },
    { timestamps: true }
);

export default mongoose.model("ContactMessage", contactMessageSchema);