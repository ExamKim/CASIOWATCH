require("dotenv").config();
const app = require("./app");
const { testDbConnection } = require("./config/db.js");

// Kiem tra ket noi database    

const PORT = process.env.PORT || 5000;

(async () => {
    try {
        await testDbConnection();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        process.exit(1);
    }
})();