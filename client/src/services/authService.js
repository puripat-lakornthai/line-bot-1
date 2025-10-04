// client/src/services/authService.js
import api from './api';

// ฟังก์ชันสำหรับ login
const login = async ({ identifier, password }) => {
  try {
    const response = await api.post('/auth/login', { identifier, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้งานที่ login อยู่
const getMe = async () => {
  try {
    const response = await api.get('/auth/me');
    return {
      success: true,
      data: response.data
    };
  } catch (err) {
    return {
      success: false,
      error: err.response?.data?.error
    };
  }
};

// ฟังก์ชันสำหรับ logout
const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Default Export แบบ object named เหมือน service อื่นๆ
// ตอนแรกใช้แบบ export แบบ default object มันติด error ตอน production
const authService = {
  login,
  logout,
  getMe,
};

export default authService;
