import express from 'express';
import * as categoryController from '../controllers/categoryController.js';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Categories
 *   description: Quản lý danh mục sản phẩm sự kiện
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateCategoryRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: Bàn ghế sự kiện
 *         description:
 *           type: string
 *           example: Các loại bàn ghế banquet, tiffany, ghế đẩu
 *     UpdateCategoryRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Bàn ghế sự kiện cao cấp
 *         description:
 *           type: string
 *           example: Bàn ghế banquet bọc nơ, bàn tròn xoay cao cấp
 *     CategoryResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 6639c01a23e41a1234567891
 *         name:
 *           type: string
 *           example: Bàn ghế sự kiện
 *         description:
 *           type: string
 *           example: Các loại bàn ghế banquet, tiffany, ghế đẩu
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-10-07T08:10:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2026-10-07T08:10:00.000Z
 */

/**
 * @openapi
 * /categories:
 *   post:
 *     summary: Tạo danh mục mới
 *     tags: [Categories]
 *     description: Thêm mới một danh mục sản phẩm. Tên danh mục không được để trống hoặc trùng lặp.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryRequest'
 *           example:
 *             name: Bàn ghế sự kiện
 *             description: Các loại bàn ghế banquet, tiffany, ghế đẩu
 *     responses:
 *       201:
 *         description: Tạo danh mục thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tạo danh mục thành công
 *                 data:
 *                   $ref: '#/components/schemas/CategoryResponse'
 *       400:
 *         description: Tên danh mục bị bỏ trống hoặc đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *   get:
 *     summary: Lấy danh sách tất cả danh mục
 *     tags: [Categories]
 *     description: Trả về danh sách danh mục kèm số lượng tổng cộng.
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lấy danh sách danh mục thành công
 *                 total:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CategoryResponse'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */
router.post('/', categoryController.createCategory);
router.get('/', categoryController.getAllCategories);

/**
 * @openapi
 * /categories/{id}:
 *   get:
 *     summary: Lấy chi tiết danh mục theo ID
 *     tags: [Categories]
 *     description: Lấy chi tiết thông tin danh mục theo ObjectId.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MongoDB ObjectId của danh mục
 *         schema:
 *           type: string
 *           example: 6639c01a23e41a1234567891
 *     responses:
 *       200:
 *         description: Lấy chi tiết thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lấy chi tiết danh mục thành công
 *                 data:
 *                   $ref: '#/components/schemas/CategoryResponse'
 *       400:
 *         description: ID không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       404:
 *         description: Không tìm thấy danh mục
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *   put:
 *     summary: Cập nhật thông tin danh mục
 *     tags: [Categories]
 *     description: Cập nhật tên hoặc mô tả danh mục.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MongoDB ObjectId của danh mục
 *         schema:
 *           type: string
 *           example: 6639c01a23e41a1234567891
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCategoryRequest'
 *           example:
 *             name: Bàn ghế sự kiện cao cấp
 *             description: Bàn ghế banquet bọc nơ, bàn tròn xoay cao cấp
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cập nhật danh mục thành công
 *                 data:
 *                   $ref: '#/components/schemas/CategoryResponse'
 *       400:
 *         description: ID không hợp lệ hoặc trùng tên danh mục
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       404:
 *         description: Không tìm thấy danh mục
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *   delete:
 *     summary: Xóa danh mục
 *     tags: [Categories]
 *     description: Xóa vĩnh viễn một danh mục khỏi hệ thống.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MongoDB ObjectId của danh mục
 *         schema:
 *           type: string
 *           example: 6639c01a23e41a1234567891
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Xóa danh mục thành công
 *                 data:
 *                   $ref: '#/components/schemas/CategoryResponse'
 *       400:
 *         description: ID không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       404:
 *         description: Không tìm thấy danh mục
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router;