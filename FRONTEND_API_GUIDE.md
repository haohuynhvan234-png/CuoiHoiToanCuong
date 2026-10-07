# 🚀 HƯỚNG DẪN KẾT NỐI API DÀNH CHO FRONTEND (FE INTEGRATION GUIDE)
> **Dự án**: Cưới Hỏi Toàn Cường (Event & Wedding Equipment Rental System)  
> **Base URL (Local)**: `http://localhost:3001/api`  
> **Swagger UI Docs**: `http://localhost:3001/api-docs`  
> **Content-Type**: `application/json`

---

## 📌 MỤC LỤC
1. [Quy ước chung & Authentication Header](#1-quy-ước-chung--authentication-header)
2. [Module 1: Authentication & Phân quyền (Auth)](#module-1-authentication--phân-quyền-auth)
3. [Module 2: Quản lý Danh mục (Categories)](#module-2-quản-lý-danh-mục-categories)
4. [Module 3: Quản lý Sản phẩm / Thiết bị cho thuê (Products)](#module-3-quản-lý-sản-phẩm--thiết-bị-cho-thuê-products)
5. [Module 4: Quản lý Đơn thuê (Rentals)](#module-4-quản-lý-đơn-thuê-rentals)
6. [Module 5: Quản lý Tài khoản (Users)](#module-5-quản-lý-tài-khoản-users)
7. [Mã trạng thái HTTP & Cấu trúc lỗi chung (Error Contract)](#7-mã-trạng-thái-http--cấu-trúc-lỗi-chung)

---

## 1. Quy ước chung & Authentication Header

- Đối với các API yêu cầu đăng nhập (Protected Routes), Frontend gửi JWT Token qua Header:
```http
Authorization: Bearer <YOUR_SYSTEM_JWT_TOKEN>
```
- Khi gọi các API trả về danh sách có liên kết dữ liệu (như Products hoặc Rentals), Backend đã tự động `populate` chi tiết Category hoặc Product.

---

## Module 1: Authentication & Phân quyền (Auth)

### 1.1. Đăng ký tài khoản mới (Local)
- **Method / Endpoint**: `POST /auth/register`
- **Auth**: Không yêu cầu
- **Payload Request**:
```json
{
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "mypassword123",
  "age": 22
}
```
- **Response Success (`201 Created`)**:
```json
{
  "message": "Đăng ký tài khoản thành công",
  "data": {
    "_id": "6639bfa923e41a1234567890",
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "role": "user",
    "authType": "local",
    "avatar": "",
    "age": 22,
    "createdAt": "2026-10-07T08:00:00.000Z",
    "updatedAt": "2026-10-07T08:00:00.000Z"
  }
}
```

---

### 1.2. Đăng nhập Email & Password
- **Method / Endpoint**: `POST /auth/login`
- **Auth**: Không yêu cầu
- **Payload Request**:
```json
{
  "email": "user@example.com",
  "password": "mypassword123"
}
```
- **Response Success (`200 OK`)**:
```json
{
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "6639bfa923e41a1234567890",
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "role": "user",
    "authType": "local",
    "avatar": "",
    "age": 22
  }
}
```

---

### 1.3. Đăng nhập bằng Google Firebase
- **Method / Endpoint**: `POST /auth/google-login`
- **Auth**: Không yêu cầu
- **Mô tả**: Frontend dùng Firebase Client SDK (`signInWithPopup`) lấy `idToken` và gửi lên API này.
- **Payload Request**:
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
}
```
- **Response Success (`200 OK`)**:
```json
{
  "message": "Đăng nhập Google thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "6639c4a123e41a1234567894",
    "name": "Hào Ki Sài Lại",
    "email": "haoki@gmail.com",
    "role": "user",
    "authType": "google",
    "avatar": "https://lh3.googleusercontent.com/a/...",
    "googleId": "460208525909"
  }
}
```

---

### 1.4. Lấy thông tin tài khoản hiện tại (`/me`)
- **Method / Endpoint**: `GET /auth/me`
- **Auth**: `Bearer <token>`
- **Response Success (`200 OK`)**:
```json
{
  "message": "Lấy thông tin người dùng thành công",
  "user": {
    "_id": "6639bfa923e41a1234567890",
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "role": "user",
    "authType": "local",
    "avatar": "",
    "age": 22
  }
}
```

---

### 1.5. Đổi mật khẩu
- **Method / Endpoint**: `PUT /auth/change-password`
- **Auth**: `Bearer <token>`
- **Payload Request**:
```json
{
  "oldPassword": "mypassword123",
  "newPassword": "newpassword456"
}
```
- **Response Success (`200 OK`)**:
```json
{
  "message": "Đổi mật khẩu thành công"
}
```

---

### 1.6. Đăng xuất
- **Method / Endpoint**: `POST /auth/logout`
- **Auth**: Không yêu cầu
- **Response Success (`200 OK`)**:
```json
{
  "message": "Đăng xuất thành công. Vui lòng xóa token ở phía client."
}
```

---

### 1.7. Kiểm tra quyền Admin Dashboard (RBAC)
- **Method / Endpoint**: `GET /auth/admin/dashboard`
- **Auth**: `Bearer <token>` (Chỉ role = `admin`)
- **Response Success (`200 OK`)**:
```json
{
  "message": "Chào mừng Admin đến với trang quản trị",
  "admin": {
    "_id": "6639bfa923e41a1234567890",
    "name": "Admin System",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```
- **Response Lỗi nếu role = `user` (`403 Forbidden`)**:
```json
{
  "message": "Bạn không có quyền truy cập tài nguyên này",
  "error": "Forbidden",
  "statusCode": 403
}
```

---

## Module 2: Quản lý Danh mục (Categories)

### 2.1. Lấy danh sách tất cả danh mục
- **Method / Endpoint**: `GET /categories`
- **Auth**: Public
- **Response Success (`200 OK`)**:
```json
{
  "message": "Lấy danh sách danh mục thành công",
  "total": 2,
  "data": [
    {
      "_id": "6639c01a23e41a1234567891",
      "name": "Bàn ghế sự kiện",
      "description": "Các loại bàn ghế banquet, tiffany, ghế đẩu tiệc cưới",
      "createdAt": "2026-10-07T08:10:00.000Z",
      "updatedAt": "2026-10-07T08:10:00.000Z"
    }
  ]
}
```

---

### 2.2. Lấy chi tiết một danh mục theo ID
- **Method / Endpoint**: `GET /categories/:id`
- **Auth**: Public
- **Response Success (`200 OK`)**:
```json
{
  "message": "Lấy chi tiết danh mục thành công",
  "data": {
    "_id": "6639c01a23e41a1234567891",
    "name": "Bàn ghế sự kiện",
    "description": "Các loại bàn ghế banquet, tiffany, ghế đẩu tiệc cưới",
    "createdAt": "2026-10-07T08:10:00.000Z",
    "updatedAt": "2026-10-07T08:10:00.000Z"
  }
}
```

---

### 2.3. Tạo danh mục mới
- **Method / Endpoint**: `POST /categories`
- **Auth**: Public / Admin
- **Payload Request**:
```json
{
  "name": "Rạp & Nhà bạt cưới",
  "description": "Nhà bạt trụ tròn, rạp sự kiện chống thấm cao cấp"
}
```
- **Response Success (`201 Created`)**:
```json
{
  "message": "Tạo danh mục thành công",
  "data": {
    "_id": "6639c01a23e41a1234567899",
    "name": "Rạp & Nhà bạt cưới",
    "description": "Nhà bạt trụ tròn, rạp sự kiện chống thấm cao cấp",
    "createdAt": "2026-10-07T09:00:00.000Z",
    "updatedAt": "2026-10-07T09:00:00.000Z"
  }
}
```

---

### 2.4. Cập nhật danh mục
- **Method / Endpoint**: `PUT /categories/:id`
- **Auth**: Public / Admin
- **Payload Request**:
```json
{
  "name": "Bàn ghế sự kiện cao cấp",
  "description": "Cập nhật mô tả danh mục"
}
```
- **Response Success (`200 OK`)**:
```json
{
  "message": "Cập nhật danh mục thành công",
  "data": {
    "_id": "6639c01a23e41a1234567891",
    "name": "Bàn ghế sự kiện cao cấp",
    "description": "Cập nhật mô tả danh mục"
  }
}
```

---

### 2.5. Xóa danh mục
- **Method / Endpoint**: `DELETE /categories/:id`
- **Auth**: Public / Admin
- **Response Success (`200 OK`)**:
```json
{
  "message": "Xóa danh mục thành công",
  "data": {
    "_id": "6639c01a23e41a1234567891",
    "name": "Bàn ghế sự kiện cao cấp"
  }
}
```

---

## Module 3: Quản lý Sản phẩm / Thiết bị cho thuê (Products)

### 3.1. Lấy danh sách sản phẩm (Hỗ trợ Search & Filter)
- **Method / Endpoint**: `GET /products`
- **Auth**: Public
- **Query Parameters**:
  - `search` (string): Tìm kiếm gần đúng theo tên sản phẩm.
  - `category` (string ObjectId): Lọc theo Category ID.
  - `isAvailable` (boolean): `true` hoặc `false`.
  - `minPrice` (number): Giá thuê tối thiểu / ngày.
  - `maxPrice` (number): Giá thuê tối đa / ngày.
- **Ví dụ gọi**: `GET /products?search=Tiffany&isAvailable=true&minPrice=30000&maxPrice=100000`
- **Response Success (`200 OK`)**:
```json
{
  "message": "Lấy danh sách sản phẩm thành công",
  "total": 1,
  "data": [
    {
      "_id": "6639c12b23e41a1234567892",
      "name": "Ghế Tiffany Vàng Gold",
      "description": "Ghế tiffany kèm nệm da trắng sang trọng cho tiệc cưới",
      "pricePerDay": 45000,
      "quantity": 200,
      "image": "https://example.com/images/ghe-tiffany.jpg",
      "location": "Kho Quận 7, TP.HCM",
      "category": {
        "_id": "6639c01a23e41a1234567891",
        "name": "Bàn ghế sự kiện",
        "description": "Các loại bàn ghế banquet, tiffany"
      },
      "isAvailable": true,
      "createdAt": "2026-10-07T08:15:00.000Z",
      "updatedAt": "2026-10-07T08:15:00.000Z"
    }
  ]
}
```

---

### 3.2. Lấy chi tiết một sản phẩm theo ID
- **Method / Endpoint**: `GET /products/:id`
- **Auth**: Public
- **Response Success (`200 OK`)**:
```json
{
  "message": "Lấy chi tiết sản phẩm thành công",
  "data": {
    "_id": "6639c12b23e41a1234567892",
    "name": "Ghế Tiffany Vàng Gold",
    "description": "Ghế tiffany kèm nệm da trắng sang trọng cho tiệc cưới",
    "pricePerDay": 45000,
    "quantity": 200,
    "image": "https://example.com/images/ghe-tiffany.jpg",
    "location": "Kho Quận 7, TP.HCM",
    "category": {
      "_id": "6639c01a23e41a1234567891",
      "name": "Bàn ghế sự kiện",
      "description": "Các loại bàn ghế banquet, tiffany"
    },
    "isAvailable": true
  }
}
```

---

### 3.3. Tạo sản phẩm mới
- **Method / Endpoint**: `POST /products`
- **Auth**: Public / Admin
- **Lưu ý**: `category` phải là ObjectId thực tế đã tạo trong module Categories.
- **Payload Request**:
```json
{
  "name": "Ghế Tiffany Vàng Gold",
  "description": "Ghế tiffany kèm nệm da trắng sang trọng cho tiệc cưới",
  "pricePerDay": 45000,
  "quantity": 200,
  "image": "https://example.com/images/ghe-tiffany.jpg",
  "location": "Kho Quận 7, TP.HCM",
  "category": "6639c01a23e41a1234567891",
  "isAvailable": true
}
```
- **Response Success (`201 Created`)**:
```json
{
  "message": "Tạo sản phẩm thành công",
  "data": {
    "_id": "6639c12b23e41a1234567892",
    "name": "Ghế Tiffany Vàng Gold",
    "description": "Ghế tiffany kèm nệm da trắng sang trọng cho tiệc cưới",
    "pricePerDay": 45000,
    "quantity": 200,
    "image": "https://example.com/images/ghe-tiffany.jpg",
    "location": "Kho Quận 7, TP.HCM",
    "category": "6639c01a23e41a1234567891",
    "isAvailable": true
  }
}
```

---

### 3.4. Cập nhật sản phẩm
- **Method / Endpoint**: `PUT /products/:id`
- **Auth**: Public / Admin
- **Payload Request**:
```json
{
  "pricePerDay": 50000,
  "quantity": 180,
  "isAvailable": true
}
```
- **Response Success (`200 OK`)**:
```json
{
  "message": "Cập nhật sản phẩm thành công",
  "data": {
    "_id": "6639c12b23e41a1234567892",
    "name": "Ghế Tiffany Vàng Gold",
    "pricePerDay": 50000,
    "quantity": 180,
    "isAvailable": true
  }
}
```

---

### 3.5. Xóa sản phẩm
- **Method / Endpoint**: `DELETE /products/:id`
- **Auth**: Public / Admin
- **Response Success (`200 OK`)**:
```json
{
  "message": "Xóa sản phẩm thành công",
  "data": {
    "_id": "6639c12b23e41a1234567892",
    "name": "Ghế Tiffany Vàng Gold"
  }
}
```

---

## Module 4: Quản lý Đơn thuê (Rentals)

### 4.1. Tạo đơn thuê mới (Booking Order)
- **Method / Endpoint**: `POST /rentals`
- **Auth**: Public / Client
- **Payload Request**:
```json
{
  "customerName": "Trần Thị B",
  "phone": "0901234567",
  "address": "123 Nguyễn Hữu Thọ, Tân Phong, Quận 7, TP.HCM",
  "eventDate": "2026-11-20T08:00:00.000Z",
  "returnDate": "2026-11-22T18:00:00.000Z",
  "products": [
    {
      "product": "6639c12b23e41a1234567892",
      "quantity": 50,
      "price": 45000
    }
  ],
  "totalPrice": 2250000,
  "status": "pending",
  "note": "Giao đồ trước 7h sáng ngày 20/11"
}
```
- **Response Success (`201 Created`)**:
```json
{
  "message": "Tạo đơn thuê thành công",
  "data": {
    "_id": "6639c25f23e41a1234567893",
    "customerName": "Trần Thị B",
    "phone": "0901234567",
    "address": "123 Nguyễn Hữu Thọ, Tân Phong, Quận 7, TP.HCM",
    "eventDate": "2026-11-20T08:00:00.000Z",
    "returnDate": "2026-11-22T18:00:00.000Z",
    "products": [
      {
        "product": "6639c12b23e41a1234567892",
        "quantity": 50,
        "price": 45000
      }
    ],
    "totalPrice": 2250000,
    "status": "pending",
    "note": "Giao đồ trước 7h sáng ngày 20/11",
    "createdAt": "2026-10-07T08:30:00.000Z"
  }
}
```

---

### 4.2. Lấy danh sách tất cả đơn thuê (Populated)
- **Method / Endpoint**: `GET /rentals`
- **Auth**: Public / Admin
- **Response Success (`200 OK`)**:
```json
{
  "message": "Lấy danh sách đơn thuê thành công",
  "total": 1,
  "data": [
    {
      "_id": "6639c25f23e41a1234567893",
      "customerName": "Trần Thị B",
      "phone": "0901234567",
      "address": "123 Nguyễn Hữu Thọ, Tân Phong, Quận 7, TP.HCM",
      "eventDate": "2026-11-20T08:00:00.000Z",
      "returnDate": "2026-11-22T18:00:00.000Z",
      "products": [
        {
          "product": {
            "_id": "6639c12b23e41a1234567892",
            "name": "Ghế Tiffany Vàng Gold",
            "pricePerDay": 45000,
            "quantity": 200,
            "image": "https://example.com/images/ghe-tiffany.jpg",
            "location": "Kho Quận 7, TP.HCM"
          },
          "quantity": 50,
          "price": 45000
        }
      ],
      "totalPrice": 2250000,
      "status": "pending",
      "note": "Giao đồ trước 7h sáng ngày 20/11"
    }
  ]
}
```

---

### 4.3. Lấy chi tiết một đơn thuê theo ID
- **Method / Endpoint**: `GET /rentals/:id`
- **Auth**: Public / Admin
- **Response Success (`200 OK`)**:
```json
{
  "message": "Lấy chi tiết đơn thuê thành công",
  "data": {
    "_id": "6639c25f23e41a1234567893",
    "customerName": "Trần Thị B",
    "phone": "0901234567",
    "address": "123 Nguyễn Hữu Thọ, Tân Phong, Quận 7, TP.HCM",
    "products": [
      {
        "product": {
          "_id": "6639c12b23e41a1234567892",
          "name": "Ghế Tiffany Vàng Gold",
          "pricePerDay": 45000
        },
        "quantity": 50,
        "price": 45000
      }
    ],
    "totalPrice": 2250000,
    "status": "pending"
  }
}
```

---

### 4.4. Cập nhật đơn thuê / Trạng thái đơn hàng
- **Method / Endpoint**: `PUT /rentals/:id`
- **Auth**: Public / Admin
- **Trạng thái hợp lệ (`status`)**: `pending` | `confirmed` | `delivered` | `returned` | `cancelled`
- **Payload Request**:
```json
{
  "status": "confirmed",
  "note": "Đã nhận tiền đặt cọc 50%"
}
```
- **Response Success (`200 OK`)**:
```json
{
  "message": "Cập nhật đơn thuê thành công",
  "data": {
    "_id": "6639c25f23e41a1234567893",
    "status": "confirmed",
    "note": "Đã nhận tiền đặt cọc 50%"
  }
}
```

---

### 4.5. Xóa đơn thuê
- **Method / Endpoint**: `DELETE /rentals/:id`
- **Auth**: Public / Admin
- **Response Success (`200 OK`)**:
```json
{
  "message": "Xóa đơn thuê thành công",
  "data": {
    "_id": "6639c25f23e41a1234567893"
  }
}
```

---

## Module 5: Quản lý Tài khoản (Users)

### 5.1. Lấy danh sách tất cả Users
- **Method / Endpoint**: `GET /users`
- **Auth**: Public / Admin
- **Response Success (`200 OK`)**:
```json
[
  {
    "_id": "6639bfa923e41a1234567890",
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "role": "user",
    "age": 22,
    "createdAt": "2026-10-07T08:00:00.000Z"
  }
]
```

---

### 5.2. Lấy chi tiết User theo ID
- **Method / Endpoint**: `GET /users/:id`
- **Auth**: Public / Admin
- **Response Success (`200 OK`)**:
```json
{
  "_id": "6639bfa923e41a1234567890",
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "role": "user",
  "age": 22
}
```

---

### 5.3. Tạo User
- **Method / Endpoint**: `POST /users`
- **Auth**: Public / Admin
- **Payload Request**:
```json
{
  "name": "Trần Văn C",
  "email": "tranvanc@example.com",
  "age": 25
}
```
- **Response Success (`201 Created`)**:
```json
{
  "message": "Thành công",
  "data": {
    "_id": "6639d10a23e41a1234567895",
    "name": "Trần Văn C",
    "email": "tranvanc@example.com",
    "age": 25
  }
}
```

---

### 5.4. Cập nhật User
- **Method / Endpoint**: `PUT /users/:id`
- **Auth**: Public / Admin
- **Payload Request**:
```json
{
  "name": "Trần Văn C (Updated)",
  "age": 26
}
```
- **Response Success (`200 OK`)**:
```json
{
  "_id": "6639d10a23e41a1234567895",
  "name": "Trần Văn C (Updated)",
  "email": "tranvanc@example.com",
  "age": 26
}
```

---

### 5.5. Xóa User
- **Method / Endpoint**: `DELETE /users/:id`
- **Auth**: Public / Admin
- **Response Success (`200 OK`)**:
```json
{
  "message": "Đã xóa"
}
```

---

## 7. Mã trạng thái HTTP & Cấu trúc lỗi chung

Hệ thống API trả về mã trạng thái HTTP chuẩn kèm nội dung mô tả chi tiết:

| Mã HTTP | Ý nghĩa | Mô tả |
| :--- | :--- | :--- |
| **`200 OK`** | Thành công | Áp dụng cho GET, PUT, DELETE thành công. |
| **`201 Created`** | Tạo mới thành công | Áp dụng cho POST tạo Product, Category, Rental, User, Register. |
| **`400 Bad Request`** | Dữ liệu không hợp lệ | Thiếu tham số bắt buộc, sai định dạng ObjectId, giá/số lượng âm. |
| **`401 Unauthorized`** | Chưa xác thực | Không có Bearer Token, Token sai/hết hạn, sai email hoặc password. |
| **`403 Forbidden`** | Không đủ quyền | Tài khoản `user` cố tình truy cập route `admin`. |
| **`404 Not Found`** | Không tìm thấy | ID không tồn tại trong cơ sở dữ liệu (Category, Product, Rental, User). |
| **`409 Conflict`** | Xung đột dữ liệu | Email hoặc tên danh mục đã tồn tại. |
| **`500 Internal Server`** | Lỗi server | Lỗi ngoại lệ phía máy chủ hoặc database. |

### Cấu trúc thông báo lỗi (Error Response Format):
```json
{
  "message": "Thông báo lỗi chi tiết dành cho người dùng",
  "error": "Tên loại lỗi (BadRequest, Unauthorized, NotFound...)",
  "statusCode": 400
}
```
hoặc đối với module đơn giản:
```json
{
  "message": "Tên danh mục không được để trống"
}
```