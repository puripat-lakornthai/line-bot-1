// client/src/pages/IndexPage.jsx

import React, { useContext } from 'react';
import { Navigate, Link } from 'react-router-dom'; // Import Link เข้ามาด้วย
import AuthContext from '../contexts/AuthContext';

const IndexPage = () => {
  const { currentUser, isAuthenticated, loading } = useContext(AuthContext);

  // ขณะตรวจสอบสถานะ Login ให้แสดง Loading...
  if (loading) {
    return <div className="page-container" style={{ textAlign: 'center', paddingTop: '50px' }}>Loading...</div>;
  }

  // --- Logic สำหรับผู้ใช้ที่ Login อยู่แล้ว ---
  // ถ้า Login อยู่แล้ว ให้ redirect ไปหน้า Dashboard ที่ถูกต้อง
  if (isAuthenticated) {
    if (currentUser.role === 'admin') return <Navigate to="/admin/dashboard" replace />; // Admin ไปหน้ารายการ Ticket
    if (currentUser.role === 'staff') return <Navigate to="/staff/dashboard" replace />;
    
    // สำหรับ role อื่นๆ (ถ้ามี)
    return <Navigate to="/my-tickets" replace />;
  }

  // --- Logic สำหรับ Public (ผู้ใช้ที่ยังไม่ได้ Login) ---
  // ถ้ายังไม่ได้ Login ให้แสดงหน้า Public Homepage แทนการ Redirect
  return (
    <div className="page-container" style={{ textAlign: 'center', paddingTop: '5rem' }}>
      <h1>Welcome to Helpdesk System</h1>
      <p>ระบบแจ้งซ่อมและจัดการปัญหา</p>
      <div style={{ marginTop: '2rem' }}>
        <Link to="/login" className="btn btn-primary btn-lg">
          เข้าสู่ระบบ
        </Link>
      </div>
    </div>
  );
};

export default IndexPage;