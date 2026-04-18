const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Backend is running" });
});


const productRoutes = require("./routes/productRoutes");
app.use("/products", productRoutes);



const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);

module.exports = app;
