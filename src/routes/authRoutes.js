import express from 'express';
import {
  register,
  login,
  googleLogin,
  getMe,
  changePassword,
  logout,
  getAdminDashboard
} from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Auth
 *   description: Xác thực, đăng ký, đăng nhập (Local & Google Firebase) và phân quyền RBAC
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: Nguyễn Văn A
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           minLength: 6
 *           example: "123456"
 *         age:
 *           type: integer
 *           default: 18
 *           example: 22
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: "123456"
 *     GoogleLoginRequest:
 *       type: object
 *       required:
 *         - idToken
 *       properties:
 *         idToken:
 *           type: string
 *           description: Firebase ID Token nhận được từ Firebase Client SDK (signInWithPopup)
 *           example: "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
 *     ChangePasswordRequest:
 *       type: object
 *       required:
 *         - oldPassword
 *         - newPassword
 *       properties:
 *         oldPassword:
 *           type: string
 *           format: password
 *           example: "123456"
 *         newPassword:
 *           type: string
 *           format: password
 *           minLength: 6
 *           example: "new123456"
 *     AuthUserResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 6639bfa923e41a1234567890
 *         name:
 *           type: string
 *           example: Nguyễn Văn A
 *         email:
 *           type: string
 *           example: user@example.com
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           example: user
 *         authType:
 *           type: string
 *           enum: [local, google]
 *           example: google
 *         avatar:
 *           type: string
 *           example: "https://lh3.googleusercontent.com/a/..."
 *         googleId:
 *           type: string
 *           example: "460208525909"
 *         age:
 *           type: integer
 *           example: 22
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     AuthErrorContract:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Email hoặc mật khẩu không đúng"
 *         error:
 *           type: string
 *           example: "Unauthorized"
 *         statusCode:
 *           type: integer
 *           example: 401
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Đăng ký tài khoản người dùng mới
 *     tags: [Auth]
 *     description: Tạo tài khoản mới, password được hash bảo mật bằng bcrypt, role mặc định là user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đăng ký tài khoản thành công
 *                 data:
 *                   $ref: '#/components/schemas/AuthUserResponse'
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc thiếu trường
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthErrorContract'
 *       409:
 *         description: Email đã được đăng ký
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthErrorContract'
 *             example:
 *               message: "Email đã được đăng ký"
 *               error: "Conflict"
 *               statusCode: 409
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthErrorContract'
 */
router.post('/register', register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Đăng nhập bằng Email/Password
 *     tags: [Auth]
 *     description: Xác thực người dùng bằng email và mật khẩu. Trả về Bearer Token hết hạn sau 1 ngày.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đăng nhập thành công
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   $ref: '#/components/schemas/AuthUserResponse'
 *       400:
 *         description: Thiếu email hoặc mật khẩu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthErrorContract'
 *       401:
 *         description: Sai email hoặc mật khẩu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthErrorContract'
 *             example:
 *               message: "Email hoặc mật khẩu không đúng"
 *               error: "Unauthorized"
 *               statusCode: 401
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthErrorContract'
 */
router.post('/login', login);

/**
 * @openapi
 * /auth/google-login:
 *   post:
 *     summary: Đăng nhập bằng Google Firebase
 *     tags: [Auth]
 *     description: Nhận Firebase idToken từ Client, xác thực qua Firebase Admin SDK, tự động liên kết/tạo tài khoản MongoDB và cấp phát System JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoogleLoginRequest'
 *     responses:
 *       200:
 *         description: Đăng nhập Google thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đăng nhập Google thành công
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   $ref: '#/components/schemas/AuthUserResponse'
 *       400:
 *         description: Thiếu idToken
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthErrorContract'
 *             example:
 *               message: "idToken là bắt buộc"
 *               error: "BadRequest"
 *               statusCode: 400
 *       401:
 *         description: idToken Firebase không hợp lệ hoặc đã hết hạn
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthErrorContract'
 *             example:
 *               message: "Firebase idToken không hợp lệ hoặc đã hết hạn"
 *               error: "Unauthorized"
 *               statusCode: 401
 *       500:
 *         description: Lỗi server hoặc Firebase Admin SDK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthErrorContract'
 */
router.post('/google-login', googleLogin);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Lấy thông tin tài khoản đang đăng nhập
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     description: Yêu cầu JWT token ở Authorization header.
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lấy thông tin người dùng thành công
 *                 user:
 *                   $ref: '#/components/schemas/AuthUserResponse'
 *       401:
 *         description: Chưa xác thực hoặc token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthErrorContract'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthErrorContract'
 */
router.get('/me', authMiddleware, getMe);

/**
 * @openapi
 * /auth/change-password:
 *   put:
 *     summary: Đổi mật khẩu
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     description: Đổi mật khẩu cho người dùng hiện tại (cần xác thực oldPassword).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đổi mật khẩu thành công
 *       400:
 *         description: Mật khẩu cũ không đúng hoặc mật khẩu mới quá ngắn
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthErrorContract'
 *       401:
 *         description: Chưa xác thực token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthErrorContract'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthErrorContract'
 */
router.put('/change-password', authMiddleware, changePassword);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Đăng xuất tài khoản
 *     tags: [Auth]
 *     description: Phản hồi xác nhận để client xóa JWT Token khỏi LocalStorage/Cookies.
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đăng xuất thành công. Vui lòng xóa token ở phía client.
 */
router.post('/logout', logout);

/**
 * @openapi
 * /auth/admin/dashboard:
 *   get:
 *     summary: Dashboard quản trị (Test Role RBAC)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     description: Chỉ tài khoản có role = 'admin' mới được phép truy cập. Role 'user' sẽ trả về 403 Forbidden.
 *     responses:
 *       200:
 *         description: Truy cập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Chào mừng Admin đến với trang quản trị
 *                 admin:
 *                   $ref: '#/components/schemas/AuthUserResponse'
 *       401:
 *         description: Chưa đăng nhập hoặc token sai
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthErrorContract'
 *       403:
 *         description: Không đủ quyền truy cập (không phải Admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthErrorContract'
 *             example:
 *               message: "Bạn không có quyền truy cập tài nguyên này"
 *               error: "Forbidden"
 *               statusCode: 403
 */
router.get('/admin/dashboard', authMiddleware, authorizeRoles('admin'), getAdminDashboard);

export default router;