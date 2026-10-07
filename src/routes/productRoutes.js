import express from 'express';
import * as productController from '../controllers/productController.js';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Products
 *   description: Quản lý thiết bị / sản phẩm sự kiện
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateProductRequest:
 *       type: object
 *       required:
 *         - name
 *         - pricePerDay
 *         - quantity
 *         - category
 *       properties:
 *         name:
 *           type: string
 *           example: Ghế Tiffany Vàng Gold
 *         description:
 *           type: string
 *           example: Ghế tiffany kèm nệm da trắng sang trọng cho tiệc cưới
 *         pricePerDay:
 *           type: number
 *           minimum: 0
 *           example: 45000
 *         quantity:
 *           type: integer
 *           minimum: 0
 *           example: 200
 *         image:
 *           type: string
 *           example: https://example.com/images/ghe-tiffany.jpg
 *         location:
 *           type: string
 *           example: Kho Quận 7, TP.HCM
 *         category:
 *           type: string
 *           description: MongoDB ObjectId của Category (Lưu ý tạo Category trước rồi dán ID thật vào đây)
 *           example: 6639c01a23e41a1234567891
 *         isAvailable:
 *           type: boolean
 *           default: true
 *           example: true
 *     UpdateProductRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Ghế Tiffany Vàng Gold (Mới)
 *         description:
 *           type: string
 *           example: Ghế tiffany kèm nệm da trắng đã được bảo dưỡng mới
 *         pricePerDay:
 *           type: number
 *           minimum: 0
 *           example: 50000
 *         quantity:
 *           type: integer
 *           minimum: 0
 *           example: 180
 *         image:
 *           type: string
 *           example: https://example.com/images/ghe-tiffany-2.jpg
 *         location:
 *           type: string
 *           example: Kho Thủ Đức, TP.HCM
 *         category:
 *           type: string
 *           description: MongoDB ObjectId của Category
 *           example: 6639c01a23e41a1234567891
 *         isAvailable:
 *           type: boolean
 *           example: true
 *     ProductDetailResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 6639c12b23e41a1234567892
 *         name:
 *           type: string
 *           example: Ghế Tiffany Vàng Gold
 *         description:
 *           type: string
 *           example: Ghế tiffany kèm nệm da trắng sang trọng cho tiệc cưới
 *         pricePerDay:
 *           type: number
 *           example: 45000
 *         quantity:
 *           type: integer
 *           example: 200
 *         image:
 *           type: string
 *           example: https://example.com/images/ghe-tiffany.jpg
 *         location:
 *           type: string
 *           example: Kho Quận 7, TP.HCM
 *         category:
 *           type: string
 *           example: 6639c01a23e41a1234567891
 *         isAvailable:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-10-07T08:15:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2026-10-07T08:15:00.000Z
 *     ProductPopulatedResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 6639c12b23e41a1234567892
 *         name:
 *           type: string
 *           example: Ghế Tiffany Vàng Gold
 *         description:
 *           type: string
 *           example: Ghế tiffany kèm nệm da trắng sang trọng cho tiệc cưới
 *         pricePerDay:
 *           type: number
 *           example: 45000
 *         quantity:
 *           type: integer
 *           example: 200
 *         image:
 *           type: string
 *           example: https://example.com/images/ghe-tiffany.jpg
 *         location:
 *           type: string
 *           example: Kho Quận 7, TP.HCM
 *         category:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 6639c01a23e41a1234567891
 *             name:
 *               type: string
 *               example: Bàn ghế sự kiện
 *             description:
 *               type: string
 *               example: Các loại bàn ghế banquet, tiffany
 *         isAvailable:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2026-10-07T08:15:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2026-10-07T08:15:00.000Z
 */

/**
 * @openapi
 * /products:
 *   post:
 *     summary: Tạo sản phẩm mới
 *     tags: [Products]
 *     description: Thêm mới sản phẩm thiết bị sự kiện. Bắt buộc Category ID phải là ID thật đã tồn tại trong database (Tạo ở /api/categories trước).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductRequest'
 *     responses:
 *       201:
 *         description: Tạo sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tạo sản phẩm thành công
 *                 data:
 *                   $ref: '#/components/schemas/ProductDetailResponse'
 *       400:
 *         description: Thiếu thông tin bắt buộc hoặc dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       404:
 *         description: Category ID không tồn tại trong CSDL
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *             example:
 *               message: Category ID không tồn tại
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *   get:
 *     summary: Lấy danh sách sản phẩm (có tìm kiếm và lọc)
 *     tags: [Products]
 *     description: Lấy danh sách sản phẩm có hỗ trợ tìm kiếm tên, lọc theo category, tình trạng có sẵn và khoảng giá thuê/ngày.
 *     parameters:
 *       - name: search
 *         in: query
 *         required: false
 *         description: Tìm kiếm gần đúng theo tên sản phẩm
 *         schema:
 *           type: string
 *           example: Tiffany
 *       - name: category
 *         in: query
 *         required: false
 *         description: Lọc theo Category ObjectId
 *         schema:
 *           type: string
 *           example: 6639c01a23e41a1234567891
 *       - name: isAvailable
 *         in: query
 *         required: false
 *         description: Lọc theo trạng thái còn hàng
 *         schema:
 *           type: boolean
 *           example: true
 *       - name: minPrice
 *         in: query
 *         required: false
 *         description: Giá thuê tối thiểu / ngày
 *         schema:
 *           type: number
 *           example: 30000
 *       - name: maxPrice
 *         in: query
 *         required: false
 *         description: Giá thuê tối đa / ngày
 *         schema:
 *           type: number
 *           example: 100000
 *     responses:
 *       200:
 *         description: Lấy danh sách sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lấy danh sách sản phẩm thành công
 *                 total:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductPopulatedResponse'
 *       400:
 *         description: Category ID lọc không hợp lệ
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
router.post('/', productController.createProduct);
router.get('/', productController.getAllProducts);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Lấy chi tiết sản phẩm
 *     tags: [Products]
 *     description: Lấy thông tin chi tiết một sản phẩm theo ID kèm Category populate.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MongoDB ObjectId của sản phẩm
 *         schema:
 *           type: string
 *           example: 6639c12b23e41a1234567892
 *     responses:
 *       200:
 *         description: Lấy chi tiết sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lấy chi tiết sản phẩm thành công
 *                 data:
 *                   $ref: '#/components/schemas/ProductPopulatedResponse'
 *       400:
 *         description: ID sản phẩm không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       404:
 *         description: Không tìm thấy sản phẩm
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
 *     summary: Cập nhật sản phẩm
 *     tags: [Products]
 *     description: Chỉnh sửa thông tin sản phẩm theo ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MongoDB ObjectId của sản phẩm
 *         schema:
 *           type: string
 *           example: 6639c12b23e41a1234567892
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductRequest'
 *     responses:
 *       200:
 *         description: Cập nhật sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cập nhật sản phẩm thành công
 *                 data:
 *                   $ref: '#/components/schemas/ProductPopulatedResponse'
 *       400:
 *         description: ID hoặc thông tin cập nhật không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       404:
 *         description: Không tìm thấy sản phẩm hoặc Category ID không tồn tại
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
 *     summary: Xóa sản phẩm
 *     tags: [Products]
 *     description: Xóa vĩnh viễn một sản phẩm theo ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MongoDB ObjectId của sản phẩm
 *         schema:
 *           type: string
 *           example: 6639c12b23e41a1234567892
 *     responses:
 *       200:
 *         description: Xóa sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Xóa sản phẩm thành công
 *                 data:
 *                   $ref: '#/components/schemas/ProductDetailResponse'
 *       400:
 *         description: ID không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       404:
 *         description: Không tìm thấy sản phẩm
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
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;