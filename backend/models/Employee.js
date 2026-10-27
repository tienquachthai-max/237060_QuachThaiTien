const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: [true, "Employee ID is required"],
      unique: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    gender: {
      type: String,
      trim: true,
    },

    dateOfBirth: {
      type: String,
    },

    department: {
      type: String,
      trim: true,
    },

    position: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    hireDate: {
      type: String,
    },

    status: {
      type: String,
      trim: true,
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Employee", employeeSchema);