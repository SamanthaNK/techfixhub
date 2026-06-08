import mongoose from "mongoose";

const maintenanceContractSchema = new mongoose.Schema(
    {
        contractNumber: {
            type: String,
            unique: true,
        },
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        plan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MaintenancePlan",
            required: true,
        },
        organizationName: {
            type: String,
            trim: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        devices: [
            {
                name: String,
                category: String,
                serialNumber: String,
            },
        ],
        totalValueFCFA: Number,
        notes: String,
    },
    { timestamps: true }
);

maintenanceContractSchema.pre("save", async function () {
    if (!this.contractNumber) {
        const count = await mongoose.model("MaintenanceContract").countDocuments();
        this.contractNumber = `TFH-MC-${String(count + 1).padStart(4, "0")}`;
    }
});

export default mongoose.model("MaintenanceContract", maintenanceContractSchema);