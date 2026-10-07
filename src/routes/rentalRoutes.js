import express from 'express';
import * as rentalController from '../controllers/rentalController.js';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Rentals
 *   description: Quản lý đơn thuê thiết bị sự kiện
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     RentalItemInput:
 *       type: object
 *       required:
 *         - product
 *         - quantity
 *         - price
 *       properties:
 *         product:
 *           type: string
 *           description: MongoDB ObjectId của Product
 *           example: 6639c12b23e41a1234567892
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 50
 *         price:
 *           type: number
 *           minimum: 0
 *           example: 45000
 *     RentalItemPopulated:
 *       type: object
 *       properties:
 *         product:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 6639c12b23e41a1234567892
 *             name:
 *               type: string
 *               example: Ghế Tiffany Vàng Gold
 *             pricePerDay:
 *               type: number
 *               example: 45000
 *             quantity:
 *               type: integer
 *               example: 200
 *             image:
 *               type: string
 *               example: https://example.com/images/ghe-tiffany.jpg
 *             location:
 *               type: string
 *               example: Kho Quận 7, TP.HCM
 *         quantity:
 *           type: integer
 *           example: 50
 *         price:
 *           type: number
 *           example: 45000
 *     CreateRentalRequest:
 *       type: object
 *       required:
 *         - customerName
 *         - phone
 *         - address
 *         - eventDate
 *         - returnDate
 *         - products
 *         - totalPrice
 *       properties:
 *         customerName:
 *           type: string
 *           example: Trần Thị B
 *         phone:
 *           type: string
 *           example: 0901234567
 *         address:
 *           type: string
 *           example: 123 Nguyễn Hữu Thọ, Tân Phong, Quận 7, TP.HCM
 *         eventDate:
 *           type: string
 *           format: date-time
 *           example: 2026-11-20T08:00:00.000Z
 *         returnDate:
 *           type: string
 *           format: date-time
 *           example: 2026-11-22T18:00:00.000Z
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RentalItemInput'
 *         totalPrice:
 *           type: number
 *           minimum: 0
 *           example: 2250000
 *         status:
 *           type: string
 *           enum: [pending, confirmed, delivered, returned, cancelled]
 *           default: pending
 *           example: pending
 *         note:
 *           type: string
 *           example: Giao đồ trước 7h sáng ngày 20/11
 *     UpdateRentalRequest:
 *       type: object
 *       properties:
 *         customerName:
 *           type: string
 *           example: Trần Thị B
 *         phone:
 *           type: string
 *           example: 0901234567
 *         address:
 *           type: string
 *           example: 123 Nguyễn Hữu Thọ, Tân Phong, Quận 7, TP.HCM
 *         eventDate:
 *           type: string
 *           format: date-time
 *           example: 2026-11-20T08:00:00.000Z
 *         returnDate:
 *           type: string
 *           format: date-time
 *           example: 2026-11-22T18:00:00.000Z
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RentalItemInput'
 *         totalPrice:
 *           type: number
 *           minimum: 0
 *           example: 2250000
 *         status:
 *           type: string
 *           enum: [pending, confirmed, delivered, returned, cancelled]
 *           example: confirmed
 *         note:
 *           type: string
 *           example: Đã đặt cọc 50% tiền mặt
 *     RentalResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 6639c25f23e41a1234567893
 *         customerName:
 *           type: string
 *           example: Trần Thị B
 *         phone:
 *           type: string
 *           example: 0901234567
 *         address:
 *           type: string
 *           example: 123 Nguyễn Hữu Thọ, Tân Phong, Quận 7, TP.HCM
 *         eventDate:
 *           type: string
 *           format: date-time
 *           example: 2026-11-20T08:00:00.000Z
 *         returnDate:
 *           type: string
 *           format: date-time
 *           example: 2026-11-22T18:00:00.000Z
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RentalItemInput'
 *         totalPrice:
 *           type: number
 *           example: 2250000
 *         status:
 *           type: string
 *           example: pending
 *         note:
 *           type: string
 *           example: Giao đồ trước 7h sáng ngày 20/11
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     RentalPopulatedResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 6639c25f23e41a1234567893
 *         customerName:
 *           type: string
 *           example: Trần Thị B
 *         phone:
 *           type: string
 *           example: 0901234567
 *         address:
 *           type: string
 *           example: 123 Nguyễn Hữu Thọ, Tân Phong, Quận 7, TP.HCM
 *         eventDate:
 *           type: string
 *           format: date-time
 *           example: 2026-11-20T08:00:00.000Z
 *         returnDate:
 *           type: string
 *           format: date-time
 *           example: 2026-11-22T18:00:00.000Z
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RentalItemPopulated'
 *         totalPrice:
 *           type: number
 *           example: 2250000
 *         status:
 *           type: string
 *           example: confirmed
 *         note:
 *           type: string
 *           example: Đã đặt cọc 50% tiền mặt
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @openapi
 * /rentals:
 *   post:
 *     summary: Tạo đơn thuê mới
 *     tags: [Rentals]
 *     description: Tạo một đơn đặt thuê thiết bị sự kiện. Hệ thống sẽ tự động xác minh từng ID sản phẩm tồn tại trước khi tạo đơn.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRentalRequest'
 *     responses:
 *       201:
 *         description: Tạo đơn thuê thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tạo đơn thuê thành công
 *                 data:
 *                   $ref: '#/components/schemas/RentalResponse'
 *       400:
 *         description: Thiếu thông tin bắt buộc hoặc ID sản phẩm không tồn tại
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
 *     summary: Lấy danh sách tất cả đơn thuê
 *     tags: [Rentals]
 *     description: Trả về toàn bộ danh sách đơn thuê với thông tin sản phẩm được populate đầy đủ.
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
 *                   example: Lấy danh sách đơn thuê thành công
 *                 total:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RentalPopulatedResponse'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */
router.post('/', rentalController.createRental);
router.get('/', rentalController.getAllRentals);

/**
 * @openapi
 * /rentals/{id}:
 *   get:
 *     summary: Lấy chi tiết đơn thuê
 *     tags: [Rentals]
 *     description: Lấy thông tin chi tiết một đơn thuê theo ID kèm thông tin sản phẩm populate.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MongoDB ObjectId của đơn thuê
 *         schema:
 *           type: string
 *           example: 6639c25f23e41a1234567893
 *     responses:
 *       200:
 *         description: Lấy chi tiết đơn thuê thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lấy chi tiết đơn thuê thành công
 *                 data:
 *                   $ref: '#/components/schemas/RentalPopulatedResponse'
 *       400:
 *         description: ID đơn thuê không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       404:
 *         description: Không tìm thấy đơn thuê
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
 *     summary: Cập nhật đơn thuê / trạng thái đơn thuê
 *     tags: [Rentals]
 *     description: Cập nhật thông tin chi tiết hoặc trạng thái của đơn thuê (pending, confirmed, delivered, returned, cancelled).
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MongoDB ObjectId của đơn thuê
 *         schema:
 *           type: string
 *           example: 6639c25f23e41a1234567893
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRentalRequest'
 *     responses:
 *       200:
 *         description: Cập nhật đơn thuê thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cập nhật đơn thuê thành công
 *                 data:
 *                   $ref: '#/components/schemas/RentalPopulatedResponse'
 *       400:
 *         description: Dữ liệu cập nhật hoặc ID không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       404:
 *         description: Không tìm thấy đơn thuê
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
 *     summary: Xóa đơn thuê
 *     tags: [Rentals]
 *     description: Xóa vĩnh viễn đơn thuê theo ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MongoDB ObjectId của đơn thuê
 *         schema:
 *           type: string
 *           example: 6639c25f23e41a1234567893
 *     responses:
 *       200:
 *         description: Xóa đơn thuê thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Xóa đơn thuê thành công
 *                 data:
 *                   $ref: '#/components/schemas/RentalResponse'
 *       400:
 *         description: ID không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       404:
 *         description: Không tìm thấy đơn thuê
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
router.get('/:id', rentalController.getRentalById);
router.put('/:id', rentalController.updateRental);
router.delete('/:id', rentalController.deleteRental);

export default router;