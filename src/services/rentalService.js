import Rental from '../models/rentalModel.js';
import Product from '../models/productModel.js';

// Tao don thue moi (kiem tra san pham ton tai)
export const createRental = async (rentalData) => {
  // Kiem tra ton tai cua cac san pham trong don
  for (const item of rentalData.products) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new Error(`Sản phẩm với ID ${item.product} không tồn tại`);
    }
  }

  const rental = new Rental(rentalData);
  return await rental.save();
};

// Lay tat ca don thue va populate thong tin chi tiet san pham
export const getAllRentals = async () => {
  return await Rental.find()
    .populate('products.product', 'name pricePerDay quantity image location')
    .sort({ createdAt: -1 });
};

// Lay chi tiet don thue theo ID
export const getRentalById = async (id) => {
  return await Rental.findById(id).populate(
    'products.product',
    'name pricePerDay quantity image location'
  );
};

// Cap nhat don thue / trang thai don thue
export const updateRental = async (id, updateData) => {
  return await Rental.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  }).populate('products.product', 'name pricePerDay quantity image location');
};

// Xoa don thue
export const deleteRental = async (id) => {
  return await Rental.findByIdAndDelete(id);
};
