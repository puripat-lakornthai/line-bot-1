// client/src/pages/staff/StaffDashboardPage.jsx

// นำเข้า React และ Context
import React, { useContext } from 'react';
import AuthContext from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

// หน้าหลักของ Dashboard สำหรับพนักงาน (staff)
const StaffDashboardPage = () => {
  const { currentUser } = useContext(AuthContext); // ดึงข้อมูลผู้ใช้งานจาก context

  return (
    <div className="page-container">
      {/* หัวข้อหลักของหน้า */}
      <h2>Staff Dashboard</h2>

      {/* แสดงชื่อผู้ใช้งานและบทบาท */}
      <p>ยินดีต้อนรับ, {currentUser?.full_name || currentUser?.username} (พนักงาน)!</p>

      {/* คำอธิบายสั้น ๆ */}
      <p>หน้านี้คือศูนย์กลางในการจัดการ Ticket ที่คุณได้รับมอบหมาย และดูภาพรวมการทำงาน</p>

      <hr style={{margin:"20px 0"}}/>

      {/* เมนูด่วน (Quick Actions) */}
      <h4>ทางลัดที่ใช้บ่อย</h4>
      <ul style={{listStyle: 'none', paddingLeft: 0, display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
        {/* ปุ่มไปยังหน้ารายการ Ticket ที่ได้รับมอบหมาย */}
        <li><Link to="/staff/my-tickets" className="btn btn-primary">งานที่รับผิดชอบ</Link></li>

        {/* ปุ่มไปยังหน้ารวม Ticket ทั้งบริษัท (ใช้ route ของ admin แต่ให้ staff ดูได้) */}
        {/* <li><Link to="/admin/tickets" className="btn">ดู Ticket ทั้งหมด</Link></li> */}

        {/* ปุ่มสร้าง Ticket ใหม่ (ปิดไว้ก่อน) */}
        {/* <li><Link to="/tickets/new" className="btn" style={{backgroundColor: '#5bc0de', color: 'white'}}>สร้าง Ticket ใหม่</Link></li> */}
      </ul>

      {/* ส่วนแสดงข้อมูลสถิติผู้ใช้ (Placeholder) */}
      {/* <div style={{marginTop: "30px"}}>
        <h4>กิจกรรมของคุณ (ยังไม่เปิดใช้)</h4>
        <p><em>(ตรงนี้สามารถแสดงข้อมูล เช่น จำนวน Ticket ที่เปิดอยู่, Ticket ที่เพิ่งอัปเดต ฯลฯ)</em></p>
      </div> */}
    </div>
  );
};

export default StaffDashboardPage;
