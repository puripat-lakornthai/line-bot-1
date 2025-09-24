// client/src/utils/authUtils.js
import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'myHelpdeskToken'; // คีย์ที่ใช้เก็บ token ไว้ใน localStorage

// ดึง token จาก localStorage
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// เก็บ token ลงใน localStorage
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// ลบ token ออกจาก localStorage
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// ดึงข้อมูลผู้ใช้ (id และ role) จาก token ถ้ามี
export const getUserDataFromToken = () => {
  const token = getToken();
  if (token) {
    try {
      const decodedToken = jwtDecode(token); // ถอดรหัส token
      return {
        userId: decodedToken.id,
        role: decodedToken.role,
      };
    } catch (error) {
      console.error("Invalid token:", error); // ถ้า token ไม่ถูกต้อง ลบออก
      removeToken();
      return null;
    }
  }
  return null;
};

// ตรวจสอบว่า token หมดอายุหรือยัง
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // เวลาปัจจุบันในรูปแบบวินาที
    return decoded.exp < currentTime; // true = หมดอายุแล้ว
  } catch (error) {
    return true; // ถ้า decode ไม่ได้ ก็ถือว่าหมดอายุ
  }
};
