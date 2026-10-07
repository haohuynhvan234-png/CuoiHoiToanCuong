import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Không tìm thấy token xác thực hoặc sai định dạng',
        error: 'Unauthorized',
        statusCode: 401
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'my_super_secret_jwt_key_2026';

    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: 'Tài khoản không tồn tại hoặc đã bị xóa',
        error: 'Unauthorized',
        statusCode: 401
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Token không hợp lệ hoặc đã hết hạn',
      error: 'Unauthorized',
      statusCode: 401
    });
  }
};