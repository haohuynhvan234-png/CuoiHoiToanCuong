import mongoose from 'mongoose';
import * as productService from '../services/productService.js';
import * as categoryService from '../services/categoryService.js';

// Tao san pham moi
export const createProduct = async (req, res) => {
  try {
    const { name, description, pricePerDay, quantity, image, location, category, isAvailable } = req.body;

    if (!name || pricePerDay === undefined || quantity === undefined || !category) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin: name, pricePerDay, quantity, category' });
    }

    if (Number(pricePerDay) < 0) {
      return res.status(400).json({ message: 'Giá thuê phải lớn hơn hoặc bằng 0' });
    }

    if (Number(quantity) < 0) {
      return res.status(400).json({ message: 'Số lượng phải lớn hơn hoặc bằng 0' });
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: 'Category ID không hợp lệ' });
    }

    const existingCategory = await categoryService.getCategoryById(category);
    if (!existingCategory) {
      return res.status(404).json({ message: 'Category ID không tồn tại' });
    }

    const product = await productService.createProduct({
      name,
      description,
      pricePerDay,
      quantity,
      image,
      location,
      category,
      isAvailable
    });

    return res.status(201).json({
      message: 'Tạo sản phẩm thành công',
      data: product
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Lỗi server khi tạo sản phẩm' });
  }
};

// Lay danh sach san pham (ho tro tim kiem va loc)
export const getAllProducts = async (req, res) => {
  try {
    const filters = {
      search: req.query.search,
      category: req.query.category,
      isAvailable: req.query.isAvailable,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice
    };

    if (filters.category && !mongoose.Types.ObjectId.isValid(filters.category)) {
      return res.status(400).json({ message: 'Category ID lọc không hợp lệ' });
    }

    const products = await productService.getAllProducts(filters);
    return res.status(200).json({
      message: 'Lấy danh sách sản phẩm thành công',
      total: products.length,
      data: products
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Lỗi server khi lấy sản phẩm' });
  }
};

// Lay chi tiet san pham
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID sản phẩm không hợp lệ' });
    }

    const product = await productService.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    return res.status(200).json({
      message: 'Lấy chi tiết sản phẩm thành công',
      data: product
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Lỗi server khi lấy chi tiết sản phẩm' });
  }
};

// Cap nhat san pham
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID sản phẩm không hợp lệ' });
    }

    if (req.body.category) {
      if (!mongoose.Types.ObjectId.isValid(req.body.category)) {
        return res.status(400).json({ message: 'Category ID không hợp lệ' });
      }
      const existingCategory = await categoryService.getCategoryById(req.body.category);
      if (!existingCategory) {
        return res.status(404).json({ message: 'Category ID không tồn tại' });
      }
    }

    if (req.body.pricePerDay !== undefined && Number(req.body.pricePerDay) < 0) {
      return res.status(400).json({ message: 'Giá thuê phải lớn hơn hoặc bằng 0' });
    }

    if (req.body.quantity !== undefined && Number(req.body.quantity) < 0) {
      return res.status(400).json({ message: 'Số lượng phải lớn hơn hoặc bằng 0' });
    }

    const updatedProduct = await productService.updateProduct(id, req.body);
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    return res.status(200).json({
      message: 'Cập nhật sản phẩm thành công',
      data: updatedProduct
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Lỗi server khi cập nhật sản phẩm' });
  }
};

// Xoa san pham
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID sản phẩm không hợp lệ' });
    }

    const deletedProduct = await productService.deleteProduct(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    return res.status(200).json({
      message: 'Xóa sản phẩm thành công',
      data: deletedProduct
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Lỗi server khi xóa sản phẩm' });
  }
};
