export const REPAIR_STATUS = {
    PENDING: "pending",
    RECEIVED: "received",
    DIAGNOSING: "diagnosing",
    AWAITING_APPROVAL: "awaiting_approval",
    IN_REPAIR: "in_repair",
    QUALITY_CHECK: "quality_check",
    READY: "ready",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
};

export const DEVICE_CATEGORIES = {
    PHONE: "phone",
    LAPTOP: "laptop",
    DESKTOP: "desktop",
    SMARTWATCH: "smartwatch",
    MEDICAL_EQUIPMENT: "medical_equipment",
    KITCHEN_EQUIPMENT: "kitchen_equipment",
    SOLAR_SYSTEM: "solar_system",
    ICT_INFRASTRUCTURE: "ict_infrastructure",
    OTHER: "other",
};

export const SERVICE_TYPES = {
    REPAIR: "repair",
    MAINTENANCE: "maintenance",
    REFURBISHMENT: "refurbishment",
    TRAINING: "training",
    CONSULTATION: "consultation",
};

export const USER_ROLES = {
    CUSTOMER: "customer",
    TECHNICIAN: "technician",
    ADMIN: "admin",
    SUPER_ADMIN: "super_admin",
};

export const MAINTENANCE_PLAN_TARGETS = {
    SCHOOL: "school",
    HOSPITAL: "hospital",
    SME: "sme",
    INDIVIDUAL: "individual",
};

export const APPOINTMENT_STATUS = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
};

export const CURRENCY = "FCFA";

export default {
    REPAIR_STATUS,
    DEVICE_CATEGORIES,
    SERVICE_TYPES,
    USER_ROLES,
    MAINTENANCE_PLAN_TARGETS,
    APPOINTMENT_STATUS,
    CURRENCY,
};