# Hệ thống quản lý nhân sự trên nền tảng đám mây

## 1. Thông tin sinh viên
- Họ và tên: QUÁCH THÁI TIỀN
- MSSV: 237060
- Lớp: DH23TIN10

## 2. Mô tả hệ thống
Xây dựng hệ thống quản lý nhân sự trên nền tảng đám mây với giao diện web React, backend Node.js/Express và cơ sở dữ liệu MongoDB Atlas.

Các chức năng chính:
- Xem danh sách nhân viên
- Thêm nhân viên
- Tìm kiếm nhân viên
- Cập nhật thông tin nhân viên
- Xóa nhân viên

Dữ liệu được lưu trữ trên MongoDB Atlas. Frontend React giao tiếp với backend Node.js/Express thông qua REST API.

## 3. Công nghệ sử dụng
- Frontend: React
- Backend: Node.js, Express
- Database: MongoDB Atlas
- Version control: Git, GitHub
- Container: Docker, Docker Hub
- Deployment: Render

## 4. Cấu trúc dự án
- backend/: Chứa mã nguồn backend, xây dựng REST API và xử lý dữ liệu.
- frontend/: Chứa mã nguồn frontend, xây dựng giao diện người dùng.

## 5. Hướng dẫn chạy dự án

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Lưu ý: Cần cấu hình thông tin kết nối MongoDB Atlas trong file môi trường `.env` của Backend trước khi chạy hệ thống.

## 6. Liên kết triển khai
- GitHub Repository: https://github.com/tienquachthai-max/237060_QuachThaiTien
- Docker Hub Backend: https://hub.docker.com/r/thaitien12/hr-backend?utm_source=chatgpt.com
- Docker Hub Frontend: https://hub.docker.com/r/thaitien12/hr-frontend?utm_source=chatgpt.com
- Render App: https://web-237060.onrender.com/?utm_source=chatgpt.com
- Render API: https://api-237060.onrender.com/api/employees
- MongoDB Atlas: https://cloud.mongodb.com/v2/6adf719e2527e7d5c412b06d#/explorer/6adf72112cdfbb67ab4e11a6/237060_QuachThaiTien/employees/find