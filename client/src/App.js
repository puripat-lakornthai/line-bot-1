// นำเข้า React และ useContext สำหรับเข้าถึง context
import React, { useContext } from 'react';
// นำเข้าคอมโพเนนต์จาก react-router-dom สำหรับกำหนดเส้นทาง
import { Routes, Route } from 'react-router-dom';

// หน้า public
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './components/NotFoundPage';

// นำเข้าคอมโพเนนต์หลักต่าง ๆ ของระบบ
import Navbar from './components/Navbar';
import TicketDetailPage from './pages/TicketDetailPage';

// หน้าสำหรับผู้ดูแลระบบ (Admin)
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import StaffWorkloadPage from './pages/admin/StaffWorkloadPage';
import TicketListPage from './pages/TicketListPage';

// หน้าสำหรับพนักงาน (Staff)
import StaffDashboardPage from './pages/staff/StaffDashboardPage';
import MyTicketsPageStaff from './pages/staff/MyTicketsPage'; // เส้นทางถูกต้องหากไฟล์คือ MyTicketsPage.jsx

// ระบบตรวจการยืนยันตัวตนและสิทธิ์ของผู้ใช้
import ProtectedRoute from './routes/ProtectedRoute'; // ใช้สำหรับจำกัดสิทธิ์เข้าถึง route ตามสถานะ login และ role
import AuthContext from './contexts/AuthContext'; // context สำหรับสถานะการล็อกอิน

// Ant Design
import { Spin, Layout } from 'antd';

// นำเข้า ToastContainer สำหรับแสดงแจ้งเตือน popup
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// destructure layout ออกมาใช้งาน
const { Content, Footer } = Layout;

// คอมโพเนนต์หลักของแอป
function App() {
  // ดึงค่า loading จาก AuthContext เพื่อแสดงสถานะโหลดเมื่อ auth ยังไม่เสร็จ
  const { loading: authLoading } = useContext(AuthContext);

  // ถ้า auth กำลังโหลดอยู่ ให้แสดงหน้าจอ loading
  if (authLoading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <div style={{ transform: 'scale(2)' }}>
          <Spin size="large" />
        </div>
        <div style={{ marginTop: 70, fontSize: '1.8rem' }}>
          กำลังโหลด...
        </div>
      </div>
    );
  }

  // เมื่อโหลดเสร็จแล้ว ให้เรนเดอร์เส้นทางของแอป
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* แถบนำทางด้านบน */}
      <Navbar />

      {/* ส่วนเนื้อหาหลักของแอป */}
      <Content style={{ padding: '24px' }}>
        <Routes>
          {/* หน้าแรก และหน้า login */}
          <Route path="/" element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* เส้นทางที่ต้องล็อกอินก่อนเข้าถึง */}
          <Route element={<ProtectedRoute />}>
            <Route path="/tickets/:id" element={<TicketDetailPage />} />
          </Route>

          {/* เส้นทางเฉพาะผู้ใช้ role = admin */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/tickets" element={<TicketListPage />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/staff-workload" element={<StaffWorkloadPage />} />
          </Route>

          {/* เส้นทางสำหรับ staff และ admin */}
          <Route element={<ProtectedRoute allowedRoles={['staff', 'admin']} />}>
            <Route path="/staff/dashboard" element={<StaffDashboardPage />} />
            <Route path="/staff/my-tickets" element={<MyTicketsPageStaff />} />
          </Route>

          {/* หน้าสำหรับเส้นทางที่ไม่ตรงกับ route ไหนเลย */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Content>

      {/* Footer ด้านล่างของระบบ */}
      {/* <Footer style={{ textAlign: 'center', background: '#f0f2f5' }}>
        MyHelpdesk ©2025
      </Footer> */}

      {/* ตัวแสดงแจ้งเตือน popup ทั่วระบบ และเวลาปิดแบบ auto*/}
      <ToastContainer position="top-center" autoClose={3000} />
    </Layout>
  );
}

export default App;
