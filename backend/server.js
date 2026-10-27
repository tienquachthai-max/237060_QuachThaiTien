
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import employee routes
const employeeRoutes = require("./routes/employees");

// Middleware
app.use(cors());
app.use(express.json());

// Employee API routes
app.use("/api/employees", employeeRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "HR Management API is running",
  });
});

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });
