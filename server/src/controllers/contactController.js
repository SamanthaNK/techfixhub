import ContactMessage from "../models/ContactMessage.js";
import { sendEmail } from "../utils/emailService.js";

const submitContactMessage = async (req, res) => {
    try {
        const { fullName, email, phone, subject, message } = req.body;

        const contactMessage = await ContactMessage.create({
            fullName,
            email,
            phone,
            subject,
            message,
        });

        await sendEmail({
            to: process.env.EMAIL_USER,
            subject: `New Contact Message: ${subject}`,
            html: `
        <p><strong>From:</strong> ${fullName} (${email})</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
        }).catch(() => { });

        res.status(201).json({
            success: true,
            message:
                "Your message has been received. We will get back to you shortly.",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getContactMessages = async (req, res) => {
    try {
        const { isRead, isResolved, page = 1, limit = 20 } = req.query;
        const filter = {};

        if (isRead !== undefined) filter.isRead = isRead === "true";
        if (isResolved !== undefined) filter.isResolved = isResolved === "true";

        const skip = (page - 1) * limit;

        const [messages, total] = await Promise.all([
            ContactMessage.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            ContactMessage.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            count: messages.length,
            total,
            data: messages,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const message = await ContactMessage.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );

        if (!message) {
            return res
                .status(404)
                .json({ success: false, message: "Message not found" });
        }

        res.status(200).json({ success: true, data: message });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { submitContactMessage, getContactMessages, markAsRead };