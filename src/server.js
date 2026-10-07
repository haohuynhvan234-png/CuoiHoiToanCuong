import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { setupSwagger } from './config/swagger.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import rentalRoutes from './routes/rentalRoutes.js';

// Load biến môi trường
dotenv.config();

const app = express();

// Bật CORS cho toàn bộ request từ frontend và Swagger UI
app.use(cors());

// Middleware parse JSON và urlencoded (Hỗ trợ upload ảnh base64 kích thước lớn)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Tích hợp Swagger UI Documentation
setupSwagger(app);

// Kết nối Database
connectDB();

// Root route kiểm tra trạng thái server
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Event Rental API Server is running',
    swaggerDocs: '/api-docs'
  });
});

// Đăng ký các Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/rentals', rentalRoutes);

// Middleware xử lý route không tồn tại (404 Not Found)
app.use((req, res) => {
  res.status(404).json({
    message: `Không tìm thấy endpoint: ${req.method} ${req.originalUrl}`,
    error: 'NotFound',
    statusCode: 404
  });
});

// Middleware xử lý lỗi toàn cục (Global Error Handler)
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Lỗi hệ thống nội bộ',
    error: err.name || 'InternalServerError',
    statusCode: err.status || 500
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`📚 Swagger Docs: http://localhost:${PORT}/api-docs`);
});