const fs = require("fs").promises;
const path = require("path");

// lock đơn giản theo file
const locks = new Map();

async function acquireLock(file) {
    while (locks.get(file)) {
        await new Promise(res => setTimeout(res, 10));
    }
    locks.set(file, true);
}

function releaseLock(file) {
    locks.delete(file);
}

// đọc file JSON
async function readJson(filePath) {
    const fullPath = path.resolve(filePath);
    const data = await fs.readFile(fullPath, "utf-8");
    return JSON.parse(data);
}

// ghi file JSON (atomic)
async function writeJson(filePath, data) {
    const fullPath = path.resolve(filePath);
    const tempPath = fullPath + ".tmp";

    await acquireLock(fullPath);

    try {
        await fs.writeFile(tempPath, JSON.stringify(data, null, 2), "utf-8");
        await fs.rename(tempPath, fullPath);
    } finally {
        releaseLock(fullPath);
    }
}

module.exports = { readJson, writeJson };