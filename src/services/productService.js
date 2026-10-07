import Product from '../models/productModel.js';

// Tao san pham moi
export const createProduct = async (productData) => {
  const product = new Product(productData);
  return await product.save();
};

// Lay danh sach san pham co ho tro Search va Filter
export const getAllProducts = async (filters = {}) => {
  const query = {};

  // Tim kiem theo ten san pham
  if (filters.search) {
    query.name = { $regex: filters.search, $options: 'i' };
  }

  // Loc theo danh muc
  if (filters.category) {
    query.category = filters.category;
  }

  // Loc theo trang thai co san
  if (filters.isAvailable !== undefined) {
    query.isAvailable = filters.isAvailable === 'true' || filters.isAvailable === true;
  }

  // Loc theo khoang gia (minPrice, maxPrice)
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.pricePerDay = {};
    if (filters.minPrice !== undefined && filters.minPrice !== '') {
      query.pricePerDay.$gte = Number(filters.minPrice);
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== '') {
      query.pricePerDay.$lte = Number(filters.maxPrice);
    }
  }

  return await Product.find(query).populate('category', 'name description').sort({ createdAt: -1 });
};

// Lay chi tiet san pham theo ID
export const getProductById = async (id) => {
  return await Product.findById(id).populate('category', 'name description');
};

// Cap nhat san pham
export const updateProduct = async (id, updateData) => {
  return await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  }).populate('category', 'name description');
};

// Xoa san pham
export const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};
