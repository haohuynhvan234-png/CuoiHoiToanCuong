import Category from '../models/categoryModel.js';

// Tao danh muc moi
export const createCategory = async (categoryData) => {
  const category = new Category(categoryData);
  return await category.save();
};

// Lay tat ca danh muc
export const getAllCategories = async () => {
  return await Category.find().sort({ createdAt: -1 });
};

// Lay chi tiet danh muc theo ID
export const getCategoryById = async (id) => {
  return await Category.findById(id);
};

// Cap nhat danh muc
export const updateCategory = async (id, updateData) => {
  return await Category.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  });
};

// Xoa danh muc
export const deleteCategory = async (id) => {
  return await Category.findByIdAndDelete(id);
};
