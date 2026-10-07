import mongoose from 'mongoose';
import * as categoryService from '../services/categoryService.js';

// Tao danh muc
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Tên danh mục không được để trống' });
    }

    const category = await categoryService.createCategory({ name, description });
    return res.status(201).json({
      message: 'Tạo danh mục thành công',
      data: category
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Tên danh mục đã tồn tại' });
    }
    return res.status(500).json({ message: error.message || 'Lỗi server khi tạo danh mục' });
  }
};

// Lay danh sach danh muc
export const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    return res.status(200).json({
      message: 'Lấy danh sách danh mục thành công',
      total: categories.length,
      data: categories
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Lỗi server khi lấy danh mục' });
  }
};

// Lay chi tiet danh muc
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID danh mục không hợp lệ' });
    }

    const category = await categoryService.getCategoryById(id);
    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }

    return res.status(200).json({
      message: 'Lấy chi tiết danh mục thành công',
      data: category
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Lỗi server khi lấy chi tiết danh mục' });
  }
};

// Cap nhat danh muc
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID danh mục không hợp lệ' });
    }

    const updatedCategory = await categoryService.updateCategory(id, req.body);
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }

    return res.status(200).json({
      message: 'Cập nhật danh mục thành công',
      data: updatedCategory
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Tên danh mục đã tồn tại' });
    }
    return res.status(500).json({ message: error.message || 'Lỗi server khi cập nhật danh mục' });
  }
};

// Xoa danh muc
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID danh mục không hợp lệ' });
    }

    const deletedCategory = await categoryService.deleteCategory(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }

    return res.status(200).json({
      message: 'Xóa danh mục thành công',
      data: deletedCategory
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Lỗi server khi xóa danh mục' });
  }
};
