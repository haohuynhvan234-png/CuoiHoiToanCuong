import mongoose from 'mongoose';
import * as userService from '../services/userService.js';

export const create = async (req, res) => {
  try {
    const { name, email, age } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Tên và Email không được để trống' });
    }

    const user = await userService.createUser(req.body);
    res.status(201).json({ message: 'Thành công', data: user });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }
    res.status(500).json({ error: error.message || 'Lỗi server khi tạo người dùng' });
  }
};

export const getAll = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Lỗi server khi lấy danh sách người dùng' });
  }
};

export const getDetail = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID không hợp lệ' });
    }

    const user = await userService.getUserById(id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Lỗi server khi lấy chi tiết người dùng' });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID không hợp lệ' });
    }

    const user = await userService.updateUser(id, req.body);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    res.status(200).json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }
    res.status(500).json({ error: error.message || 'Lỗi server khi cập nhật người dùng' });
  }
};

export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID không hợp lệ' });
    }

    const user = await userService.deleteUser(id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    res.status(200).json({ message: 'Đã xóa' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Lỗi server khi xóa người dùng' });
  }
};