import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Item name is required"],
            trim: true,
        },
        sku: {
            type: String,
            unique: true,
            trim: true,
        },
        category: {
            type: String,
            enum: [
                "spare_part",
                "tool",
                "consumable",
                "refurbished_device",
                "accessory",
            ],
            required: true,
        },
        description: {
            type: String,
            trim: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        lowStockThreshold: {
            type: Number,
            default: 5,
        },
        costPriceFCFA: {
            type: Number,
            required: true,
            min: 0,
        },
        sellingPriceFCFA: {
            type: Number,
            min: 0,
        },
        supplier: {
            name: String,
            contact: String,
        },
        compatibleDevices: [{ type: String }],
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

inventorySchema.virtual("isLowStock").get(function () {
    return this.quantity <= this.lowStockThreshold;
});

inventorySchema.pre("save", async function () {
    if (!this.sku) {
        const count = await mongoose.model("Inventory").countDocuments();
        this.sku = `TFH-INV-${String(count + 1).padStart(5, "0")}`;
    }
});

export default mongoose.model("Inventory", inventorySchema);