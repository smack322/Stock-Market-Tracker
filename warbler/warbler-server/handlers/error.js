function errorHandler(error, request, response, next) {
    return response.status(error.stat || 500).json({
        error: {
            message: error.message || "Oops! Something went wrong."
        }
    });
}

module.exports = errorHandler;