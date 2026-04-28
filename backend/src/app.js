const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Backend is running" });
});

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);
const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);

const productRoutes = require("./routes/productRoutes");
app.use("/products", productRoutes);

const cartRoutes = require("./routes/cartRoutes");
app.use("/cart", cartRoutes);

const orderRoutes = require("./routes/orderRoutes");
app.use("/orders", orderRoutes);

const paymentRoutes = require("./routes/paymentRoutes");
app.use("/payments", paymentRoutes);



const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);




module.exports = app;
