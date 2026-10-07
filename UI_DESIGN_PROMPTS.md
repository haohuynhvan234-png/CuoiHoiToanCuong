# 🎨 BỘ PROMPT AI TẠO GIAO DIỆN (UI/UX DESIGN & FRONTEND)
> **Dự án**: Cưới Hỏi Toàn Cường – Hệ Thống Cho Thuê Bàn Ghế, Rạp & Phụ Kiện Sự Kiện  
> **Tương thích tốt nhất với**: **v0.dev**, **Lovable.dev**, **Bolt.new**, **Claude 3.7 Sonnet**, **ChatGPT (GPT-4o)**, **Figma AI**.

---

## 📌 MỤC LỤC
1. [Master Prompt – Toàn bộ dự án (All-in-One)](#1-master-prompt--toàn-bộ-dự-án-all-in-one)
2. [Prompt Trang Chủ & Danh mục sản phẩm (Homepage & Catalog)](#2-prompt-trang-chủ--catalog-khách-hàng)
3. [Prompt Chi tiết sản phẩm & Giỏ thuê đồ (Product Detail & Rental Cart)](#3-prompt-chi-tiết-sản-phẩm--giỏ-hàng-thuê)
4. [Prompt Đặt đơn thuê & Quản lý đơn hàng (Booking & Rental Order)](#4-prompt-thủ-tục-đặt-thuê--theo-dõi-đơn)
5. [Prompt Modal Đăng nhập / Đăng ký (Email + Google Firebase)](#5-prompt-xác-thực-auth-modal--google-login)
6. [Prompt Admin Dashboard – Quản trị toàn diện](#6-prompt-admin-dashboard-quản-trị-hệ-thống)

---

## 1. Master Prompt – Toàn bộ dự án (All-in-One)
> *Sử dụng prompt này khi muốn AI tạo cấu trúc khung toàn bộ ứng dụng web (Next.js / React + Tailwind CSS + Shadcn UI).*

```markdown
Hãy đóng vai là một Senior Frontend Developer và UI/UX Designer hàng đầu. 
Hãy thiết kế và viết toàn bộ giao diện Web React (Tailwind CSS, Lucide Icons, Shadcn UI) cho hệ thống "CƯỚI HỎI TOÀN CƯỜNG" - Nền tảng dịch vụ cho thuê thiết bị, bàn ghế, nhà bạt và phụ kiện sự kiện/tiệc cưới cao cấp.

### 🎨 PHONG CÁCH THIẾT KẾ (Design System):
- Màu chủ đạo: Đỏ tiệc cưới thanh lịch kết hợp Vàng Gold (#D32F2F, #D4AF37) hoặc Trắng / Xám nhạt hiện đại (#F8FAFC, #0F172A).
- Font chữ: Sans-serif hiện đại (Inter / Plus Jakarta Sans), tiêu đề có nét sang trọng.
- Phong cách: Clean, Modern Luxury, chuẩn Responsive (Mobile / Tablet / Desktop), tối ưu chuyển động (Framer Motion).

### 🧩 CÁC TRANG & TÍNH NĂNG CẦN XÂY DỰNG:
1. **Header & Navigation**: Logo Cưới Hỏi Toàn Cường, Menu (Trang chủ, Danh mục bàn ghế, Rạp sự kiện, Bảng giá, Liên hệ), Thanh tìm kiếm nhanh, Nút Đăng nhập/Đăng ký (có Google Sign-In), Giỏ đồ thuê (kèm badge đếm số lượng).
2. **Khách hàng (Client Facing)**:
   - Trang chủ: Hero banner giới thiệu dịch vụ, bộ lọc nhanh theo ngày thuê/danh mục, grid sản phẩm nổi bật, feedback khách hàng, form tư vấn.
   - Trang danh mục & bộ lọc: Lọc theo Category ID, khoảng giá/ngày (minPrice - maxPrice), trạng thái có sẵn (isAvailable), tìm kiếm regex.
   - Chi tiết sản phẩm: Ảnh sắc nét, đơn giá theo ngày, số lượng kho còn lại, vị trí kho, chọn ngày bắt đầu - ngày trả, nút "Thêm vào đơn thuê".
   - Drawer / Trang Giỏ thuê (Rental Cart): Tính tổng tiền tự động = (Đơn giá × Số lượng × Số ngày), nhập thông tin khách hàng (Tên, SĐT, Địa chỉ sự kiện, Ghi chú), nút "Xác nhận gửi đơn thuê".
   - Trang cá nhân / Đơn của tôi: Xem lịch sử đơn thuê và trạng thái (pending, confirmed, delivered, returned, cancelled).
3. **Quản trị viên (Admin Dashboard)**:
   - Thống kê KPI: Tổng đơn thuê, doanh thu, thiết bị đang cho thuê, thiết bị trong kho.
   - Quản lý Sản phẩm (CRUD): Danh sách, thêm/sửa/xóa sản phẩm, upload ảnh, bật/tắt `isAvailable`.
   - Quản lý Danh mục (CRUD Category): Thêm danh mục bàn ghế, rạp, phụ kiện, âm thanh ánh sáng.
   - Quản lý Đơn thuê: Xem chi tiết danh sách thiết bị kèm số lượng, cập nhật trạng thái đơn thuê (Pending -> Confirmed -> Delivered -> Returned).
   - Quản lý Tài khoản: Xem danh sách user, phân quyền role (user/admin).

Tất cả đã sẵn sàng kết nối trực tiếp với REST API Node.js backend tại Base URL `http://localhost:3001/api`.
```

---

## 2. Prompt Trang Chủ & Catalog Khách Hàng
> *Dùng cho **v0.dev** hoặc **Lovable** để sinh trang Home & Danh sách sản phẩm.*

```markdown
Design a modern, luxurious, and responsive Event & Wedding Equipment Rental Homepage & Product Catalog in React, Tailwind CSS, and Lucide Icons.

### Components Required:
1. **Hero Section**:
   - Headline: "Cưới Hỏi Toàn Cường - Nâng Tầm Khoảnh Khắc Hạnh Phúc"
   - Quick search bar with date pickers (Event Start Date -> Return Date) and Category dropdown.
   - CTA button: "Khám Phá Thiết Bị Thuê".
2. **Category Showcase Grid**:
   - Cards showing categories: Bàn ghế Tiffany/Banquet, Rạp cưới nghệ thuật, Khung Backdrop chụp ảnh, Sân khấu & Âm thanh.
3. **Product Catalog & Live Filter**:
   - Filter Sidebar: Search text input, Category checkboxes, Price slider (0 - 500,000 VND/day), "Chỉ hiện đồ có sẵn" toggle.
   - Product Card: Image preview, Category tag, Location badge (e.g. Kho Quận 7), Price/day in VND, Available status tag, "Xem chi tiết" & "Thuê ngay" buttons.
4. **Trust & Proof Section**:
   - 4 feature blocks: "Giao lắp trọn gói tận nơi", "Thiết bị mới 99%", "Hợp đồng minh bạch", "Hỗ trợ kỹ thuật 24/7".
5. **Footer**:
   - Contact hotline, address, working hours, social links.

Make the UI clean with smooth hover micro-interactions, gold-red wedding accents, and rounded-2xl cards.
```

---

## 3. Prompt Chi Tiết Sản Phẩm & Giỏ Hàng Thuê

```markdown
Tạo giao diện React + Tailwind CSS cho trang **Chi tiết sản phẩm cho thuê** và **Drawer Giỏ đồ thuê (Rental Cart Drawer)**:

### 1. Chi tiết sản phẩm (Product Detail):
- Image Gallery (ảnh lớn có zoom nhẹ, các thumbnail bên dưới).
- Thông tin sản phẩm: Tên thiết bị, Mã danh mục, Tình trạng kho (Còn hàng / Tạm hết), Địa điểm kho bãi.
- Bảng giá thuê: Giá thuê theo ngày (VD: 45.000đ/ngày/ghế).
- Bộ chọn thời gian thuê: Ngày nhận thiết bị (`eventDate`) và Ngày hoàn trả (`returnDate`).
- Bộ đếm số lượng thuê (có validation không vượt quá số lượng tồn kho `quantity`).
- Tự động tính tạm tính: `Tổng = Số lượng × Đơn giá × Số ngày`.
- Nút CTA lớn: "Thêm vào danh sách thuê" (kèm hiệu ứng bay vào giỏ).

### 2. Giỏ hàng thuê (Slide-over Cart Drawer):
- Danh sách các thiết bị đã chọn: Thumbnail, tên, đơn giá, số lượng, ngày thuê, nút xóa.
- Tổng kết chi phí: Tạm tính, Phí vận chuyển ước tính, Tổng thanh toán (`totalPrice`).
- Nút "Tiến hành đặt đơn thuê" chuyển sang form thông tin giao nhận.
```

---

## 4. Prompt Thủ Tục Đặt Thuê & Theo Dõi Đơn

```markdown
Tạo giao diện **Checkout Đơn Thuê Sự Kiện** và **Trang Theo Dõi Tiến Độ Đơn Thuê** bằng React, Tailwind CSS:

### 1. Checkout Form:
- Thông tin người thuê:
  - Họ và tên (`customerName` - Bắt buộc)
  - Số điện thoại (`phone` - Bắt buộc)
  - Địa chỉ tổ chức sự kiện / giao hàng (`address` - Bắt buộc)
  - Ghi chú (`note` - Thời gian bàn giao, yêu cầu nhân viên hỗ trợ...)
- Lịch trình thuê:
  - Ngày giờ bắt đầu sự kiện (`eventDate`)
  - Ngày giờ kết thúc & trả đồ (`returnDate`)
- Tóm tắt đơn hàng (Order Summary Box) cố định bên phải: Danh sách thiết bị, tổng tiền cọc, tổng thanh toán.
- Nút "Xác Nhận Đặt Thuê" gửi API `POST /api/rentals`.

### 2. Trang Theo Dõi Trạng Thái Đơn Hàng (Order Status Stepper):
- Timeline trạng thái đơn hàng trực quan dạng Step Bar:
  1. `pending` (Chờ tiếp nhận) -> Màu Vàng
  2. `confirmed` (Đã duyệt & Giữ đồ) -> Màu Xanh Dương
  3. `delivered` (Đã bàn giao/lắp đặt) -> Màu Tím
  4. `returned` (Đã hoàn tất & Thu hồi đồ) -> Màu Xanh Lá
  5. `cancelled` (Đã hủy) -> Màu Đỏ
- Hiển thị chi tiết từng món đồ kèm hình ảnh và đơn giá.
```

---

## 5. Prompt Xác Thực (Auth Modal & Google Login)

```markdown
Thiết kế Modal Đăng Nhập / Đăng Ký (Authentication Modal) cho website với React, Tailwind CSS, Firebase Auth SDK:

### Yêu Cầu Giao Diện:
- Tab chuyển đổi mượt mà giữa: **Đăng nhập** và **Đăng ký**.
- **Đăng nhập Google (Ưu tiên hàng đầu)**:
  - Nút lớn "Đăng nhập nhanh với Google" (kèm logo Google nhiều màu sắc).
  - Tích hợp hàm `signInWithPopup(auth, googleProvider)` gửi `idToken` lên API `POST /api/auth/google-login`.
- **Đăng nhập bằng Email/Password**:
  - Input Email (có icon Mail).
  - Input Mật khẩu (có nút ẩn/hiện mật khẩu).
  - Nút "Đăng nhập".
- **Đăng ký tài khoản mới**:
  - Input Họ tên (`name`), Email, Mật khẩu (`password` tối thiểu 6 ký tự), Tuổi (`age`).
- **Profile Popover (Khi đã đăng nhập)**:
  - Hiển thị Avatar (Google avatar hoặc placeholder), Tên, Email, Badge quyền (`user` hoặc `admin`).
  - Menu: "Đơn thuê của tôi", "Đổi mật khẩu", "Trang Admin" (nếu là admin), "Đăng xuất".
```

---

## 6. Prompt Admin Dashboard (Quản Trị Hệ Thống)

```markdown
Thiết kế trang **Admin Dashboard Quản Trị Hệ Thống Cưới Hỏi Toàn Cường** (Desktop First, Sidebar Navigation, phong cách Shadcn UI / Tailwind):

### 1. Sidebar Navigation:
- Logo hệ thống & Tag "Admin Portal".
- Menu items: Tổng quan (Dashboard), Quản lý Đơn thuê (Rentals), Quản lý Sản phẩm (Products), Quản lý Danh mục (Categories), Quản lý Khách hàng (Users), Cài đặt.
- User profile admin ở góc dưới kèm nút Đăng xuất.

### 2. Màn hình Quản Lý Đơn Thuê (Rentals Management):
- Bộ lọc theo Status: Tất cả, Chờ xử lý, Đã xác nhận, Đang cho thuê, Đã trả đồ, Đã hủy.
- Bảng dữ liệu (Data Table): Mã đơn, Tên khách hàng, SĐT, Ngày sự kiện, Ngày trả, Tổng tiền (Format VND), Trạng thái (Badge màu), Thao tác (Xem chi tiết, Đổi trạng thái nhanh bằng Dropdown, Xóa).
- Modal chi tiết đơn thuê: Danh sách sản phẩm được populate, ảnh thumbnail, địa chỉ tổ chức sự kiện.

### 3. Màn hình Quản Lý Sản Phẩm (Products Management):
- Nút "Thêm sản phẩm mới" -> Mở Modal nhập: Tên sản phẩm, Danh mục (Dropdown lấy từ `/api/categories`), Giá thuê/ngày, Số lượng trong kho, Vị trí kho, Link ảnh, Toggle còn hàng.
- Bảng danh sách: Ảnh, Tên, Danh mục, Đơn giá, Số lượng, Trạng thái (Switch toggle `isAvailable`), Nút Sửa, Nút Xóa.

### 4. Màn hình Quản Lý Danh Mục (Categories Management):
- Form thêm danh mục nhanh: Tên danh mục, Mô tả.
- Grid thẻ danh mục hiển thị số lượng sản phẩm liên kết kèm nút Sửa/Xóa.
```

---

## 💡 Hướng dẫn sử dụng:
1. Mở trang [v0.dev](https://v0.dev) hoặc [lovable.dev](https://lovable.dev).
2. Copy một trong các prompt trên (Master Prompt hoặc từng màn hình cụ thể).
3. Dán vào ô chat của AI để sinh mã nguồn giao diện hoàn chỉnh.