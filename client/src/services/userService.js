// client/src/services/userService.js
import api from './api';

// ดึงผู้ใช้ทั้งหมด (รองรับ pagination)
// const getAllUsers = async (page = 1, limit = 10) => {
//   const response = await api.get(`/users?page=${page}&limit=${limit}`);
//   return response.data;
// };

// ดึงผู้ใช้ทั้งหมดใช้ pagination ด้วย page + limit
// const getAllUsers = async (page = 1, limit = 1) => {
//   const response = await api.get('/users', {
//     params: { page, limit }
//   });
//   return response.data; // { users, total, totalPages, currentPage }
// };

// ดึงผู้ใช้ทั้งหมด (ไม่ใช้ pagination)
const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

// ดึงข้อมูลผู้ใช้ตาม ID
const getUserById = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

// เพิ่มผู้ใช้ใหม่โดย admin
const createUserByAdmin = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

// แก้ไขข้อมูลผู้ใช้โดย admin
const updateUserByAdmin = async (userId, userData) => {
  const response = await api.put(`/users/${userId}`, userData);
  return response.data;
};

// ลบผู้ใช้โดย admin
const deleteUserByAdmin = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};

// ดึงรายชื่อพนักงานที่มี role = 'staff'
const getAllStaff = async () => {
  const response = await api.get('/users/staff');
  return response.data;
};

// export ฟังก์ชันทั้งหมดแบบ object
export default {
  getAllUsers,
  getUserById,
  createUserByAdmin,
  updateUserByAdmin,
  deleteUserByAdmin,
  getAllStaff,
};
