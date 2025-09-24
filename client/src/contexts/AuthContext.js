import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // สำหรับ redirect และเช็ค path ปัจจุบัน
import { jwtDecode } from 'jwt-decode';
import { getToken, setToken as storeToken, removeToken, isTokenExpired } from '../utils/authUtils';
import authService from '../services/authService';
import { toast } from 'react-toastify';

// สร้าง context สำหรับ authentication
const AuthContext = createContext(null);

// Provider สำหรับห่อ component ทั้งระบบ
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // ข้อมูลผู้ใช้ที่ login อยู่
  const [loading, setLoading] = useState(true);         // ใช้ระบุว่ากำลังโหลดหรือไม่
  const navigate = useNavigate();
  const location = useLocation();

  // ฟังก์ชันเตะออกเมื่อ token หมดอายุหรือไม่ถูกต้อง
  const handleTokenExpired = useCallback(() => {
    removeToken();
    setCurrentUser(null);

    // แสดง toast แค่ถ้า user อยู่ในหน้า protected
    if (location.pathname !== '/' && location.pathname !== '/login') {
      toast.warn("เซสชันหมดอายุแล้ว กรุณาเข้าสู่ระบบใหม่");
      navigate('/');
    }
  }, [navigate, location.pathname]);

  // ฟังก์ชันสำหรับออกจากระบบ
  const logout = () => {
    console.log("Logging out user.");
    removeToken();
    setCurrentUser(null);
    toast.success("ออกจากระบบเรียบร้อยแล้ว"); // แจ้งเตือนด้วย popup
    navigate('/');
  };

  // ทำงานทันทีเมื่อ component นี้ถูก mount
  useEffect(() => {
    const token = getToken();

    // ถ้าไม่มี token → ไม่ต้องทำอะไร (อยู่ที่หน้า login ก็ปล่อยไว้)
    if (!token) {
      setLoading(false);
      return;
    }

    // ถ้ามี token → ตรวจว่าหมดอายุไหม
    if (isTokenExpired(token)) {
      handleTokenExpired(); // ✅ เตะออกถ้า token หมดอายุ
    } else {
      try {
        const decoded = jwtDecode(token);
        setCurrentUser(decoded); // ตั้งค่าผู้ใช้จาก token
      } catch (err) {
        console.error("Token decode failed:", err);
        handleTokenExpired(); // เตะออกถ้า token พัง
      }
    }

    setLoading(false); // หยุดแสดงสถานะโหลดเมื่อเสร็จ

    // ดักฟัง event "auth-error-unauthorized"
    const handleUnauthorizedError = () => {
      handleTokenExpired();
    };
    window.addEventListener('auth-error-unauthorized', handleUnauthorizedError);
    return () => {
      window.removeEventListener('auth-error-unauthorized', handleUnauthorizedError);
    };
  }, [handleTokenExpired]);

  // เตะออกอัตโนมัติทุกนาที ถ้า token หมดอายุระหว่างที่ user ใช้งานอยู่
  useEffect(() => {
    const interval = setInterval(() => {
      const token = getToken();
      if (token && isTokenExpired(token)) {
        console.warn("🔐 Token expired — logging out");
        handleTokenExpired();
      }
    }, 60 * 1000); // ตรวจทุก 60 วินาที

    return () => clearInterval(interval);
  }, [handleTokenExpired]);

  // ฟังก์ชันสำหรับเข้าสู่ระบบ
  const login = async (credentials) => {
    try {
      // 1. ส่ง credentials ไป login ที่ backend
      const response = await authService.login(credentials);

      // 2. ถ้า login สำเร็จและมี token ให้เก็บลง localStorage
      if (response.success && response.data?.token) {
        const token = response.data.token;
        storeToken(token);

        try {
          // 3. พยายามดึงข้อมูลผู้ใช้จาก backend
          const meResponse = await authService.getMe();

          // 4. ถ้าดึงข้อมูลสำเร็จ ให้ตั้ง currentUser จาก backend
          if (meResponse?.success && meResponse.data) {
            setCurrentUser(meResponse.data);
            setLoading(false);
            toast.success('เข้าสู่ระบบสำเร็จ (ผ่าน getMe)');
            return meResponse.data;
          }

          // 5. ถ้า response จาก backend ผิด format หรือ error จะเข้า catch ด้านล่าง
          throw new Error('getMe ไม่สำเร็จ');
        } catch (getMeError) {
          // 6. fallback decode token เพื่อให้ใช้งานได้แม้ getMe พัง
          try {
            const decoded = jwtDecode(token);
            setCurrentUser(decoded);
            setLoading(false);
            toast.success('เข้าสู่ระบบสำเร็จ (ผ่าน decode token)');
            return decoded;
          } catch (decodeErr) {
            throw new Error('Token ไม่สามารถ decode ได้ และ getMe ก็ล้มเหลว');
          }
        }
      }

      // 7. ถ้า login ไม่สำเร็จ ให้โยน error ออกไป
      throw new Error(response.message || 'Login failed');
    } catch (err) {
      // 8. ถ้ามี error ใด ๆ ให้ลบ token และหยุด loading
      setLoading(false);
      removeToken();
      throw err;
    }
  };

  // ฟังก์ชันสำหรับลงทะเบียน (ยังไม่ระบุ)
  const register = async (userData) => { /* ... */ };

  // ฟังก์ชันสำหรับ refresh ข้อมูลผู้ใช้ (สามารถเขียนเพิ่มได้ในอนาคต)
  const refreshCurrentUser = useCallback(async () => { /* ... */ }, []);

  // สร้าง context value ที่จะส่งให้กับ component อื่น ๆ
  const value = {
    currentUser,
    login,
    logout,
    register,
    loading,
    isAuthenticated: !!currentUser && !isTokenExpired(getToken()), // ตรวจว่า login และ token ยังไม่หมดอายุ
    refreshCurrentUser
  };

  // ส่ง context ให้ children
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
