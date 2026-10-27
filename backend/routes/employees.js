const express = require("express");
const Employee = require("../models/Employee");

const router = express.Router();

// GET /api/employees
// Lấy danh sách nhân viên + tìm kiếm theo mã hoặc tên
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;

    let filter = {};

    if (search && search.trim() !== "") {
      filter = {
        $or: [
          {
            employeeId: {
              $regex: search.trim(),
              $options: "i",
            },
          },
          {
            fullName: {
              $regex: search.trim(),
              $options: "i",
            },
          },
        ],
      };
    }

    const employees = await Employee.find(filter).sort({
      employeeId: 1,
    });

    res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách nhân viên",
      error: error.message,
    });
  }
});

// GET /api/employees/:id
router.get("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy nhân viên",
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể lấy thông tin nhân viên",
      error: error.message,
    });
  }
});

// POST /api/employees
router.post("/", async (req, res) => {
  try {
    const { employeeId, fullName, email } = req.body;

    if (!employeeId || !fullName || !email) {
      return res.status(400).json({
        success: false,
        message: "employeeId, fullName và email là bắt buộc",
      });
    }

    const existingEmployee = await Employee.findOne({
      employeeId,
    });

    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message: "Employee ID đã tồn tại",
      });
    }

    const employee = await Employee.create(req.body);

    res.status(201).json({
      success: true,
      message: "Thêm nhân viên thành công",
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể thêm nhân viên",
      error: error.message,
    });
  }
});

// PUT /api/employees/:id
router.put("/:id", async (req, res) => {
  try {
    const { employeeId, fullName, email } = req.body;

    if (!employeeId || !fullName || !email) {
      return res.status(400).json({
        success: false,
        message: "employeeId, fullName và email là bắt buộc",
      });
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy nhân viên",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật nhân viên thành công",
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể cập nhật nhân viên",
      error: error.message,
    });
  }
});

// DELETE /api/employees/:id
router.delete("/:id", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(
      req.params.id
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy nhân viên",
      });
    }

    res.status(200).json({
      success: true,
      message: "Xóa nhân viên thành công",
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể xóa nhân viên",
      error: error.message,
    });
  }
});

module.exports = router;