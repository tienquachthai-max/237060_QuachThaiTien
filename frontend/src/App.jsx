
import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/employees";

const emptyForm = {
  employeeId: "",
  fullName: "",
  gender: "Nam",
  dateOfBirth: "",
  department: "",
  position: "",
  email: "",
  phone: "",
  hireDate: "",
  status: "Active",
};

function displayStatus(status) {
  return status === "Active" || status === "Đang làm việc"
    ? "Đang làm việc"
    : "Tạm nghỉ";
}

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadEmployees(searchText = search) {
    try {
      const query = searchText.trim()
        ? `?search=${encodeURIComponent(searchText.trim())}`
        : "";

      const response = await fetch(`${API_URL}${query}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Không tải được nhân viên");
      }

      setEmployees(result.data);
    } catch (error) {
      setMessage("Lỗi tải nhân viên: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEmployees("");
  }, []);

  const filteredEmployees = employees.filter((employee) =>
    `${employee.employeeId} ${employee.fullName}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function openAddForm() {
    setForm({ ...emptyForm });
    setEditingId(null);
    setShowForm(true);
    setMessage("");
  }

  function openEditForm(employee) {
    setForm({
      ...emptyForm,
      ...employee,
      status: displayStatus(employee.status),
    });
    setEditingId(employee._id);
    setShowForm(true);
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const payload = {
      ...form,
      employeeId: form.employeeId.trim(),
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      status: form.status === "Đang làm việc" ? "Active" : form.status,
    };

    try {
      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            result.error ||
            "Không thể lưu nhân viên"
        );
      }

      await loadEmployees();
      setMessage(
        editingId
          ? "Cập nhật nhân viên thành công!"
          : "Thêm nhân viên thành công!"
      );
      setShowForm(false);
      setForm({ ...emptyForm });
      setEditingId(null);
    } catch (error) {
      setMessage("Lỗi lưu nhân viên: " + error.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteEmployee(employee) {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa ${employee.fullName}?`
    );

    if (!confirmed) return;

    setMessage("");

    try {
      const response = await fetch(`${API_URL}/${employee._id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Không thể xóa nhân viên"
        );
      }

      await loadEmployees();
      setMessage("Xóa nhân viên thành công!");
    } catch (error) {
      setMessage("Lỗi xóa nhân viên: " + error.message);
    }
  }

  const workingCount = employees.filter(
    (employee) => displayStatus(employee.status) === "Đang làm việc"
  ).length;

  const departmentCount = new Set(
    employees.map((employee) => employee.department).filter(Boolean)
  ).size;

  return (
    <main className="container">
      <header className="header">
        <div>
          <p className="eyebrow">HỆ THỐNG NỘI BỘ</p>
          <h1>Quản lý nhân sự</h1>
          <p className="subtitle">
            Quản lý hồ sơ và thông tin nhân viên
          </p>
        </div>

        <button className="primary-button" onClick={openAddForm}>
          + Thêm nhân viên
        </button>
      </header>

      <section className="stats">
        <div className="stat-card">
          <span>Tổng số nhân viên</span>
          <strong>{employees.length}</strong>
        </div>

        <div className="stat-card">
          <span>Đang làm việc</span>
          <strong>{workingCount}</strong>
        </div>

        <div className="stat-card">
          <span>Phòng ban</span>
          <strong>{departmentCount}</strong>
        </div>
      </section>

      {message && (
        <p className="message" role="status">
          {message}
        </p>
      )}

      {showForm && (
        <section className="panel">
          <h2>
            {editingId ? "Cập nhật nhân viên" : "Thêm nhân viên mới"}
          </h2>

          <form onSubmit={handleSubmit} className="employee-form">
            <label>
              Mã nhân viên *
              <input
                name="employeeId"
                value={form.employeeId}
                onChange={handleChange}
                required
                disabled={Boolean(editingId)}
                placeholder="VD: NV004"
              />
            </label>

            <label>
              Họ và tên *
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                placeholder="Nhập họ tên"
              />
            </label>

            <label>
              Giới tính
              <select
                name="gender"
                value={form.gender || "Nam"}
                onChange={handleChange}
              >
                <option value="Nam">Nam</option>
                <option value="Nu">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </label>

            <label>
              Ngày sinh
              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth || ""}
                onChange={handleChange}
              />
            </label>

            <label>
              Phòng ban *
              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                required
                placeholder="Nhập phòng ban"
              />
            </label>

            <label>
              Chức vụ *
              <input
                name="position"
                value={form.position}
                onChange={handleChange}
                required
                placeholder="Nhập chức vụ"
              />
            </label>

            <label>
              Email *
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="email@example.com"
              />
            </label>

            <label>
              Số điện thoại
              <input
                name="phone"
                value={form.phone || ""}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
              />
            </label>

            <label>
              Ngày vào làm
              <input
                type="date"
                name="hireDate"
                value={form.hireDate || ""}
                onChange={handleChange}
              />
            </label>

            <label>
              Trạng thái
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="Đang làm việc">Đang làm việc</option>
                <option value="Tạm nghỉ">Tạm nghỉ</option>
              </select>
            </label>

            <div className="form-actions">
              <button
                className="primary-button"
                type="submit"
                disabled={saving}
              >
                {saving ? "Đang lưu..." : "Lưu thông tin"}
              </button>

              <button
                className="secondary-button"
                type="button"
                onClick={() => setShowForm(false)}
                disabled={saving}
              >
                Hủy
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="panel">
        <div className="table-heading">
          <div>
            <h2>Danh sách nhân viên</h2>
            <p>Dữ liệu lấy từ cơ sở dữ liệu qua API</p>
          </div>

          <input
            className="search-input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm mã nhân viên hoặc họ tên..."
            aria-label="Tìm kiếm nhân viên"
          />
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Mã NV</th>
                <th>Họ và tên</th>
                <th>Phòng ban</th>
                <th>Chức vụ</th>
                <th>Email</th>
                <th>Điện thoại</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="empty">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty">
                    Không tìm thấy nhân viên phù hợp.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => {
                  const status = displayStatus(employee.status);

                  return (
                    <tr key={employee._id}>
                      <td>{employee.employeeId}</td>
                      <td className="employee-name">{employee.fullName}</td>
                      <td>{employee.department}</td>
                      <td>{employee.position}</td>
                      <td>{employee.email}</td>
                      <td>{employee.phone}</td>
                      <td>
                        <span
                          className={
                            status === "Đang làm việc"
                              ? "status active"
                              : "status inactive"
                          }
                        >
                          {status}
                        </span>
                      </td>
                      <td>
                        <div className="actions">
                          <button
                            className="edit-button"
                            onClick={() => openEditForm(employee)}
                          >
                            Sửa
                          </button>

                          <button
                            className="delete-button"
                            onClick={() => deleteEmployee(employee)}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <p className="table-footer">
          Hiển thị {filteredEmployees.length} / {employees.length} nhân viên
        </p>
      </section>

      <footer>
        Hệ thống quản lý nhân sự · Thực hành điện toán đám mây
      </footer>
    </main>
  );
}
