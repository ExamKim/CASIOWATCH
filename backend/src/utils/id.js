function generateId(prefix = "id") {
    return `${prefix}_${Date.now()}`;
}

module.exports = { generateId };