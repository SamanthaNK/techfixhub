import mongoose from "mongoose";

const trainingProgramSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Program title is required"],
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: [
                "phone_repair",
                "laptop_repair",
                "electrical",
                "networking",
                "solar",
                "medical_equipment",
                "entrepreneurship",
            ],
            required: true,
        },
        level: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"],
            required: true,
        },
        durationWeeks: {
            type: Number,
            required: true,
        },
        schedule: {
            type: String,
            trim: true,
        },
        priceFCFA: {
            type: Number,
            required: true,
            min: 0,
        },
        maxEnrollment: {
            type: Number,
            required: true,
        },
        currentEnrollment: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        startDate: Date,
        endDate: Date,
        instructor: {
            name: String,
            bio: String,
        },
        syllabus: [{ type: String }],
        prerequisites: [{ type: String }],
        certificateOffered: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

trainingProgramSchema.virtual("availableSlots").get(function () {
    return this.maxEnrollment - this.currentEnrollment;
});

trainingProgramSchema.pre("save", function () {
    if (this.isModified("title")) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    }
});

export default mongoose.model("TrainingProgram", trainingProgramSchema);