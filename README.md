# REST API Cho Thuê Bàn Ghế, Rạp Cưới & Phụ Kiện Sự Kiện

Dự án Backend REST API hoàn chỉnh phục vụ quản lý cho thuê thiết bị sự kiện (bàn ghế, rạp, backdrop, âm thanh, ánh sáng, phụ kiện cưới hỏi).

---

## 1. Công nghệ sử dụng
- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose ODM**
- **ES Module** (`import` / `export`)
- **dotenv**, **nodemon**

---

## 2. Cấu trúc thư mục
```text
EventRentalAPI/
├── src/
│   ├── config/
│   │   └── db.js                 # Cấu hình kết nối MongoDB
│   ├── models/
│   │   ├── categoryModel.js      # Model Danh mục sản phẩm
│   │   ├── productModel.js       # Model Sản phẩm cho thuê
│   │   └── rentalModel.js        # Model Đơn thuê đồ
│   ├── services/
│   │   ├── categoryService.js    # Tầng Service Danh mục
│   │   ├── productService.js     # Tầng Service Sản phẩm (Search & Filter)
│   │   └── rentalService.js      # Tầng Service Đơn thuê
│   ├── controllers/
│   │   ├── categoryController.js # Tầng Controller Danh mục
│   │   ├── productController.js  # Tầng Controller Sản phẩm
│   │   └── rentalController.js   # Tầng Controller Đơn thuê
│   ├── routes/
│   │   ├── categoryRoutes.js     # Router danh mục
│   │   ├── productRoutes.js      # Router sản phẩm
│   │   └── rentalRoutes.js       # Router đơn thuê
│   └── server.js                 # Entrypoint khởi chạy Express Server
├── .env                          # Biến môi trường
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 3. Hướng dẫn cài đặt & Chạy ứng dụng

### Bước 1: Cài đặt dependencies
```bash
npm install
```

### Bước 2: Cấu hình file `.env`
Tạo file `.env` (hoặc copy từ `.env.example`):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/event_rental_db
```

### Bước 3: Chạy ứng dụng
- Môi trường phát triển (Dev - nodemon tự reload khi code thay đổi):
  ```bash
  npm run dev
  ```
- Môi trường chạy chuẩn:
  ```bash
  npm start
  ```

---

## 4. Mô hình dữ liệu & Quan hệ

### 4.1. Category Model (`src/models/categoryModel.js`)
- `name`: Tên danh mục (ví dụ: *Bàn ghế sự kiện, Rạp cưới, Âm thanh ánh sáng*).
- `description`: Mô tả chi tiết.

### 4.2. Product Model (`src/models/productModel.js`)
- `name`: Tên thiết bị/phụ kiện cho thuê (ví dụ: *Ghế Tiffany, Rạp cưới hoa lụa 5x10m*).
- `description`: Mô tả chi tiết.
- `pricePerDay`: Giá thuê theo ngày.
- `quantity`: Số lượng trong kho.
- `image`: URL ảnh sản phẩm.
- `location`: Vị trí kho/khu vực hỗ trợ.
- `category`: `ObjectId` liên kết tham chiếu (`ref: 'Category'`).
- `isAvailable`: Trạng thái sẵn sàng cho thuê (`true`/`false`).

### 4.3. Rental Model (`src/models/rentalModel.js`)
- `customerName`: Tên khách hàng thuê.
- `phone`: Số điện thoại.
- `address`: Địa chỉ giao hàng & thi công.
- `eventDate`: Ngày bắt đầu sự kiện.
- `returnDate`: Ngày tháo dỡ hoàn trả.
- `products`: Danh sách chi tiết các mặt hàng thuê:
  - `product`: `ObjectId` tham chiếu đến `Product` (`ref: 'Product'`).
  - `quantity`: Số lượng thuê.
  - `price`: Giá thuê tại thời điểm đặt.
- `totalPrice`: Tổng số tiền đơn thuê.
- `status`: Trạng thái đơn (`pending`, `confirmed`, `delivered`, `returned`, `cancelled`).
- `note`: Ghi chú thêm.

---

## 5. Danh sách Endpoints REST API

### 5.1. Quản lý Danh mục (`/api/categories`)
| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `POST` | `/api/categories` | Tạo danh mục mới |
| `GET` | `/api/categories` | Lấy danh sách tất cả danh mục |
| `GET` | `/api/categories/:id` | Lấy chi tiết 1 danh mục theo ID |
| `PUT` | `/api/categories/:id` | Cập nhật thông tin danh mục |
| `DELETE` | `/api/categories/:id` | Xóa danh mục |

### 5.2. Quản lý Sản phẩm cho thuê (`/api/products`)
| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `POST` | `/api/products` | Tạo sản phẩm mới |
| `GET` | `/api/products` | Lấy danh sách sản phẩm (có hỗ trợ Search & Filter) |
| `GET` | `/api/products/:id` | Lấy chi tiết sản phẩm theo ID (có `populate` category) |
| `PUT` | `/api/products/:id` | Cập nhật thông tin sản phẩm |
| `DELETE` | `/api/products/:id` | Xóa sản phẩm |

**Query parameters hỗ trợ cho `GET /api/products`:**
- `search`: Tìm kiếm tương đối theo tên sản phẩm (`?search=Tiffany`)
- `category`: Lọc theo ID danh mục (`?category=662...`)
- `isAvailable`: Lọc theo trạng thái còn hàng (`?isAvailable=true`)
- `minPrice` & `maxPrice`: Lọc theo khoảng giá thuê (`?minPrice=50000&maxPrice=200000`)

### 5.3. Quản lý Đơn thuê (`/api/rentals`)
| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `POST` | `/api/rentals` | Tạo đơn đặt thuê mới |
| `GET` | `/api/rentals` | Lấy toàn bộ đơn thuê (tự động `populate` thông tin Product) |
| `GET` | `/api/rentals/:id` | Lấy chi tiết đơn thuê theo ID |
| `PUT` | `/api/rentals/:id` | Cập nhật đơn thuê / cập nhật trạng thái đơn |
| `DELETE` | `/api/rentals/:id` | Xóa đơn thuê |

---

## 6. Mẫu dữ liệu Request mẫu dùng để test Postman

### 1. Tạo Category:
```http
POST /api/categories
Content-Type: application/json

{
  "name": "Bàn ghế sự kiện",
  "description": "Các loại bàn tròn, bàn dài, ghế banquet, ghế Tiffany sang trọng"
}
```

### 2. Tạo Product:
```http
POST /api/products
Content-Type: application/json

{
  "name": "Ghế Tiffany mạ vàng",
  "description": "Ghế Tiffany cao cấp đệm trắng phục vụ tiệc cưới",
  "pricePerDay": 45000,
  "quantity": 200,
  "image": "https://example.com/images/tiffany-gold.jpg",
  "location": "Kho Hà Nội",
  "category": "<CATEGORY_ID_VỪA_TẠO>",
  "isAvailable": true
}
```

### 3. Tạo Đơn thuê Rental:
```http
POST /api/rentals
Content-Type: application/json

{
  "customerName": "Nguyễn Văn A",
  "phone": "0912345678",
  "address": "Khách sạn Daewoo, Ba Đình, Hà Nội",
  "eventDate": "2026-11-15T08:00:00.000Z",
  "returnDate": "2026-11-16T18:00:00.000Z",
  "products": [
    {
      "product": "<PRODUCT_ID_VỪA_TẠO>",
      "quantity": 100,
      "price": 45000
    }
  ],
  "totalPrice": 4500000,
  "status": "pending",
  "note": "Giao đồ trước 7h sáng ngày 15/11"
}
```
