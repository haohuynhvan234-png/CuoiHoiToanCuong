import express from 'express';
import { create, getAll, getDetail, update, remove } from '../controllers/userController.js';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Users
 *   description: Quản lý người dùng hệ thống
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           example: Nguyễn Văn A
 *         email:
 *           type: string
 *           format: email
 *           example: nguyenvana@example.com
 *         age:
 *           type: integer
 *           default: 18
 *           example: 22
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Nguyễn Văn A (Updated)
 *         email:
 *           type: string
 *           format: email
 *           example: nguyenvana_new@example.com
 *         age:
 *           type: integer
 *           example: 25
 *     UserResponse:
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
 *           example: nguyenvana@example.com
 *         age:
 *           type: integer
 *           example: 22
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-10-07T08:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2026-10-07T08:00:00.000Z
 */

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Tạo người dùng mới
 *     tags: [Users]
 *     description: Thêm mới một User vào hệ thống. Email phải là duy nhất.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *           example:
 *             name: Nguyễn Văn A
 *             email: nguyenvana@example.com
 *             age: 22
 *     responses:
 *       201:
 *         description: Tạo người dùng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Thành công
 *                 data:
 *                   $ref: '#/components/schemas/UserResponse'
 *       500:
 *         description: Lỗi server (trùng email hoặc lỗi mongoose)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   get:
 *     summary: Lấy danh sách tất cả người dùng
 *     tags: [Users]
 *     description: Trả về danh sách tất cả người dùng trong hệ thống.
 *     responses:
 *       200:
 *         description: Danh sách users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserResponse'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', create);
router.get('/', getAll);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết một User
 *     tags: [Users]
 *     description: Lấy chi tiết user thông qua ObjectId.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MongoDB ObjectId của User
 *         schema:
 *           type: string
 *           example: 6639bfa923e41a1234567890
 *     responses:
 *       200:
 *         description: Tìm thấy user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       404:
 *         description: Không tìm thấy User
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             example:
 *               message: Không tìm thấy
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Cập nhật thông tin User
 *     tags: [Users]
 *     description: Cập nhật thông tin của User theo ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MongoDB ObjectId của User
 *         schema:
 *           type: string
 *           example: 6639bfa923e41a1234567890
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *           example:
 *             name: Nguyễn Văn A (Updated)
 *             age: 25
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Xóa User
 *     tags: [Users]
 *     description: Xóa vĩnh viễn user khỏi cơ sở dữ liệu.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MongoDB ObjectId của User
 *         schema:
 *           type: string
 *           example: 6639bfa923e41a1234567890
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             example:
 *               message: Đã xóa
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', getDetail);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;