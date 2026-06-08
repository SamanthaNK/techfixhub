import RepairRequest from "../models/RepairRequest.js";
import { REPAIR_STATUS, USER_ROLES } from "../config/constants.js";

const submitRepairRequest = async (req, res) => {
    try {
        const {
            deviceCategory,
            deviceBrand,
            deviceModel,
            issueDescription,
            priority,
        } = req.body;

        const repairRequest = await RepairRequest.create({
            customer: req.user._id,
            deviceCategory,
            deviceBrand,
            deviceModel,
            issueDescription,
            priority,
        });

        res.status(201).json({
            success: true,
            message: "Repair request submitted successfully",
            data: repairRequest,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const trackRepair = async (req, res) => {
    try {
        const repair = await RepairRequest.findOne({
            trackingId: req.params.trackingId.toUpperCase(),
        })
            .select(
                "trackingId status statusHistory deviceCategory deviceBrand deviceModel estimatedCost finalCost estimatedCompletionDate currency createdAt"
            )
            .populate("assignedTechnician", "firstName lastName");

        if (!repair) {
            return res.status(404).json({
                success: false,
                message: "No repair request found with that tracking ID",
            });
        }

        res.status(200).json({
            success: true,
            data: repair,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getMyRepairs = async (req, res) => {
    try {
        const repairs = await RepairRequest.find({ customer: req.user._id })
            .sort({ createdAt: -1 })
            .populate("assignedTechnician", "firstName lastName");

        res.status(200).json({
            success: true,
            count: repairs.length,
            data: repairs,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getRepairById = async (req, res) => {
    try {
        const repair = await RepairRequest.findById(req.params.id)
            .populate("customer", "firstName lastName email phone")
            .populate("assignedTechnician", "firstName lastName");

        if (!repair) {
            return res
                .status(404)
                .json({ success: false, message: "Repair request not found" });
        }

        if (
            req.user.role === USER_ROLES.CUSTOMER &&
            repair.customer._id.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        res.status(200).json({ success: true, data: repair });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateRepairStatus = async (req, res) => {
    try {
        const { status, note, estimatedCost, finalCost, estimatedCompletionDate } =
            req.body;

        const repair = await RepairRequest.findById(req.params.id);

        if (!repair) {
            return res
                .status(404)
                .json({ success: false, message: "Repair request not found" });
        }

        repair.status = status;

        // Add to status history
        repair.statusHistory.push({
            status,
            note: note || undefined,
            updatedBy: req.user._id,
        });

        if (estimatedCost !== undefined) repair.estimatedCost = estimatedCost;
        if (finalCost !== undefined) repair.finalCost = finalCost;
        if (estimatedCompletionDate)
            repair.estimatedCompletionDate = estimatedCompletionDate;
        if (status === REPAIR_STATUS.COMPLETED) repair.completedAt = new Date();

        await repair.save();

        res.status(200).json({
            success: true,
            message: "Repair status updated",
            data: repair,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAllRepairs = async (req, res) => {
    try {
        const { status, category, page = 1, limit = 20 } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (category) filter.deviceCategory = category;

        const skip = (page - 1) * limit;

        const [repairs, total] = await Promise.all([
            RepairRequest.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .populate("customer", "firstName lastName phone")
                .populate("assignedTechnician", "firstName lastName"),
            RepairRequest.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            count: repairs.length,
            total,
            pages: Math.ceil(total / limit),
            currentPage: Number(page),
            data: repairs,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export {
    submitRepairRequest,
    trackRepair,
    getMyRepairs,
    getRepairById,
    updateRepairStatus,
    getAllRepairs,
};