import User from '../models/userModel.js';

export const createUser = (data) => User.create(data);
export const getAllUsers = () => User.find();
export const getUserById = (id) => User.findById(id);
export const updateUser = (id, data) => User.findByIdAndUpdate(id, data, { new: true });
export const deleteUser = (id) => User.findByIdAndDelete(id);
