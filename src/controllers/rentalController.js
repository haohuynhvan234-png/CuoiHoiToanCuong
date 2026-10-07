import mongoose from 'mongoose';
import * as rentalService from '../services/rentalService.js';

// Tao don thue moi
export const createRental = async (req, res) => {
  try {
    const { customerName, phone, address, eventDate, returnDate, products, totalPrice, status, note } = req.body;

    if (!customerName || !phone || !address || !eventDate || !returnDate || !products || !totalPrice) {
      return res.status(400).json({
        message: 'Vui lòng cung cấp đầy đủ: customerName, phone, address, eventDate, returnDate, products, totalPrice'
      });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Danh sách sản phẩm thuê không được để trống' });
    }

    for (const item of products) {
      if (!item.product || !mongoose.Types.ObjectId.isValid(item.product)) {
        return res.status(400).json({ message: 'ID sản phẩm trong đơn thuê không hợp lệ' });
      }
      if (!item.quantity || Number(item.quantity) < 1) {
        return res.status(400).json({ message: 'Số lượng sản phẩm thuê phải lớn hơn hoặc bằng 1' });
      }
      if (item.price === undefined || Number(item.price) < 0) {
        return res.status(400).json({ message: 'Đơn giá sản phẩm thuê không thể nhỏ hơn 0' });
      }
    }

    if (Number(totalPrice) < 0) {
      return res.status(400).json({ message: 'Tổng tiền không thể nhỏ hơn 0' });
    }

    const rental = await rentalService.createRental({
      customerName,
      phone,
      address,
      eventDate,
      returnDate,
      products,
      totalPrice,
      status,
      note
    });

    return res.status(201).json({
      message: 'Tạo đơn thuê thành công',
      data: rental
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Lỗi khi tạo đơn thuê' });
  }
};

// Lay tat ca don thue
export const getAllRentals = async (req, res) => {
  try {
    const rentals = await rentalService.getAllRentals();
    return res.status(200).json({
      message: 'Lấy danh sách đơn thuê thành công',
      total: rentals.length,
      data: rentals
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Lỗi server khi lấy đơn thuê' });
  }
};

// Lay chi tiet don thue theo ID
export const getRentalById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID đơn thuê không hợp lệ' });
    }

    const rental = await rentalService.getRentalById(id);
    if (!rental) {
      return res.status(404).json({ message: 'Không tìm thấy đơn thuê' });
    }

    return res.status(200).json({
      message: 'Lấy chi tiết đơn thuê thành công',
      data: rental
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Lỗi server khi lấy chi tiết đơn thuê' });
  }
};

// Cap nhat don thue
export const updateRental = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID đơn thuê không hợp lệ' });
    }

    if (req.body.products) {
      if (!Array.isArray(req.body.products) || req.body.products.length === 0) {
        return res.status(400).json({ message: 'Danh sách sản phẩm thuê không được để trống' });
      }
      for (const item of req.body.products) {
        if (!item.product || !mongoose.Types.ObjectId.isValid(item.product)) {
          return res.status(400).json({ message: 'ID sản phẩm trong đơn thuê không hợp lệ' });
        }
      }
    }

    const updatedRental = await rentalService.updateRental(id, req.body);
    if (!updatedRental) {
      return res.status(404).json({ message: 'Không tìm thấy đơn thuê' });
    }

    return res.status(200).json({
      message: 'Cập nhật đơn thuê thành công',
      data: updatedRental
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Lỗi server khi cập nhật đơn thuê' });
  }
};

// Xoa don thue
export const deleteRental = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID đơn thuê không hợp lệ' });
    }

    const deletedRental = await rentalService.deleteRental(id);
    if (!deletedRental) {
      return res.status(404).json({ message: 'Không tìm thấy đơn thuê' });
    }

    return res.status(200).json({
      message: 'Xóa đơn thuê thành công',
      data: deletedRental
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Lỗi server khi xóa đơn thuê' });
  }
};
