module.exports = (err, req, res, next) => {
    console.error(err);

    res.status(500 || err.status).json({
        message: err.message || "Internal Server Error"
    });
};