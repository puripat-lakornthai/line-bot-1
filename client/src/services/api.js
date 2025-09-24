// client/src/services/api.js
import axios from 'axios';
import { getToken, removeToken, isTokenExpired } from '../utils/authUtils';

// อ่าน URL ของ Backend จาก .env (หรือใช้ localhost ถ้าไม่กำหนด)
const BACKEND_API_BASE_URL =
  process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

// สร้าง instance ของ axios สำหรับเรียก API ทั้งแอป
const api = axios.create({
  // ทุก request จะไปที่ BASE_URL + path ที่ระบุ
  baseURL: `${BACKEND_API_BASE_URL}/api`,
  // กำหนด header มาตรฐานให้ส่ง JSON
  headers: { 'Content-Type': 'application/json' },
  // กำหนด timeout 10 วินาที ป้องกัน request ค้างนาน
  timeout: 10000,
  //ส่ง cookie/token ข้าม origin ได้
  // withCredentials: true
});

// ► Request interceptor: ทำงานก่อนส่งทุกคำขอ
api.interceptors.request.use(
  (config) => {
    // ดึง token ที่เก็บใน localStorage
    const token = getToken();
    // ถ้ามี token และยังไม่หมดอายุ
    if (token && !isTokenExpired(token)) {
      // แนบ Authorization header แบบ Bearer
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  // กรณี error ระหว่างตั้งค่า config ให้ reject ต่อ
  (error) => Promise.reject(error)
);

// ► Response interceptor: ทำงานหลังได้ response หรือ error มา
api.interceptors.response.use(
  // กรณี response ปกติ (status 2xx) ก็ให้ return ตรงๆ
  (response) => response,

  // กรณี error (status นอก 2xx) เข้ามาที่นี่
  (error) => {
    // ตรวจว่า URL ปัจจุบันเป็นหน้า /login หรือไม่
    const isLoginPage = window.location.pathname.includes('/login');
    // ดึง status code และ data body จาก response
    const status = error?.response?.status;
    const data = error?.response?.data;

    // ถ้า 401 Unauthorized หรือ 403 Forbidden แปลว่า token หมดอายุหรือไม่มีสิทธิ์
    if (status === 401) {
      console.warn('Token หมดอายุ');
      removeToken(); // ลบได้เฉพาะตอน 401
      if (!isLoginPage) {
        window.dispatchEvent(new CustomEvent('auth-error-unauthorized'));
      }
    }

    if (status === 403) {
      console.warn('403 Forbidden: ไม่มีสิทธิ์เข้าถึง');
      // ไม่ลบ token ปล่อยให้ component จัดการเอง (เช่น alert แจ้งเตือน)
    }

    // ถ้ามี data จาก controller (เช่น { success:false, error:'...' })
    // ให้ reject ด้วย data นั้น เพื่อให้ฝั่ง authService หรือ LoginPage อ่าน error.error ได้ตรงๆ
    if (data) {
      return Promise.reject(data);
    }

    // กรณีอื่น ๆ ให้ reject ด้วย error object เดิม (network error, timeout ฯลฯ)
    return Promise.reject(error);
  }
);

export default api;
