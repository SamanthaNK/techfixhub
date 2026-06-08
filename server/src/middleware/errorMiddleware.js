const notFound = (req, res) => {
    const error = new Error(`Route not found: ${req.originalUrl}`);
    res.status(404);
    throw error;
};

const errorHandler = (err, req, res) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    if (err.name === "CastError") {
        message = "Resource not found";
        statusCode = 404;
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        message = `An account with that ${field} already exists`;
        statusCode = 400;
    }

    if (err.name === "ValidationError") {
        message = Object.values(err.errors)
            .map((e) => e.message)
            .join(", ");
        statusCode = 400;
    }

    if (err.name === "JsonWebTokenError") {
        message = "Invalid authentication token";
        statusCode = 401;
    }

    if (err.name === "TokenExpiredError") {
        message = "Authentication token expired";
        statusCode = 401;
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};

export { notFound, errorHandler };