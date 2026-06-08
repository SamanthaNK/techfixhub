import TrainingProgram from "../models/TrainingProgram.js";
import Enrollment from "../models/Enrollment.js";

const getPrograms = async (req, res) => {
    try {
        const { category, level } = req.query;
        const filter = { isActive: true };

        if (category) filter.category = category;
        if (level) filter.level = level;

        const programs = await TrainingProgram.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: programs.length,
            data: programs,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getProgramById = async (req, res) => {
    try {
        const program = await TrainingProgram.findById(req.params.id);

        if (!program || !program.isActive) {
            return res
                .status(404)
                .json({ success: false, message: "Training program not found" });
        }

        res.status(200).json({ success: true, data: program });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const enrollInProgram = async (req, res) => {
    try {
        const program = await TrainingProgram.findById(req.params.id);

        if (!program || !program.isActive) {
            return res
                .status(404)
                .json({ success: false, message: "Training program not found" });
        }

        if (program.currentEnrollment >= program.maxEnrollment) {
            return res.status(400).json({
                success: false,
                message: "This program is fully booked",
            });
        }

        const existingEnrollment = await Enrollment.findOne({
            student: req.user._id,
            program: program._id,
        });

        if (existingEnrollment) {
            return res.status(400).json({
                success: false,
                message: "You are already enrolled in this program",
            });
        }

        const enrollment = await Enrollment.create({
            student: req.user._id,
            program: program._id,
        });

        program.currentEnrollment += 1;
        await program.save();

        res.status(201).json({
            success: true,
            message: "Enrollment submitted successfully. Our team will contact you.",
            data: enrollment,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getMyEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ student: req.user._id })
            .populate("program", "title category level durationWeeks priceFCFA")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: enrollments.length,
            data: enrollments,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createProgram = async (req, res) => {
    try {
        const program = await TrainingProgram.create(req.body);
        res.status(201).json({
            success: true,
            message: "Training program created",
            data: program,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateProgram = async (req, res) => {
    try {
        const program = await TrainingProgram.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!program) {
            return res
                .status(404)
                .json({ success: false, message: "Training program not found" });
        }

        res.status(200).json({ success: true, data: program });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export {
    getPrograms,
    getProgramById,
    enrollInProgram,
    getMyEnrollments,
    createProgram,
    updateProgram,
};