export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Chưa xác thực người dùng',
        error: 'Unauthorized',
        statusCode: 401
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Bạn không có quyền truy cập tài nguyên này',
        error: 'Forbidden',
        statusCode: 403
      });
    }

    next();
  };
};