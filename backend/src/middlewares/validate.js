module.exports.validateProduct = (req, res, next) => {
    const {
        name,
        category,
        gender,
        price,
        stock,
        status
    } = req.body;

    // 🧱 1. Name
    if (!name || name.trim() === "") {
        return res.status(400).json({ message: "Name is required" });
    }

    // 🏷️ 2. Category
    if (!category || category.trim() === "") {
        return res.status(400).json({ message: "Category is required" });
    }

    // 👤 3. Gender
    const validGender = ["men", "women", "unisex"];
    if (!validGender.includes(gender)) {
        return res.status(400).json({
            message: "Gender must be men, women or unisex"
        });
    }

    // 💰 4. Price
    if (price == null || price <= 0) {
        return res.status(400).json({
            message: "Price must be > 0"
        });
    }

    // 📦 5. Stock
    if (stock == null || stock < 0) {
        return res.status(400).json({
            message: "Stock must be >= 0"
        });
    }

    // 📊 6. Status
    const validStatus = ["active", "inactive"];
    if (!validStatus.includes(status)) {
        return res.status(400).json({
            message: "Status must be active or inactive"
        });
    }

    next();
};