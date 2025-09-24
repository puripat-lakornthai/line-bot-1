import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { Typography, Spin } from 'antd';
import ticketService from '../services/ticketService';
import userService from '../services/userService';
import TicketCard from '../components/TicketCard';
import TicketFilter from '../components/TicketFilter';
import AuthContext from '../contexts/AuthContext'; // ใช้สำหรับดึงข้อมูลผู้ใช้ปัจจุบัน
import { toast } from 'react-toastify';
import '../styles/TicketListPage.css';

const { Title } = Typography;

const TicketListPage = () => {
  const { currentUser } = useContext(AuthContext); // ดึงข้อมูลผู้ใช้จาก context
  const isAdmin = currentUser?.role === 'admin';   // ตรวจสอบว่าเป็น admin หรือไม่

  const [tickets, setTickets] = useState([]); // รายการ ticket
  const [isLoading, setIsLoading] = useState(false); // สถานะโหลด
  const [hasMore, setHasMore] = useState(true); // ใช้กับ infinite scroll
  const [currentPage, setCurrentPage] = useState(1); // หน้าปัจจุบัน
  const [staffList, setStaffList] = useState([]); // รายชื่อ staff/admin
  const observerRef = useRef(null); // สำหรับดัก scroll ถึงท้าย list

  const [filters, setFilters] = useState({
    status: '',
    assignee_id: '',
    sort_by: 'updated_at',
    sort_order: 'DESC',
  });

  // อัปเดตค่าฟิลเตอร์เมื่อผู้ใช้เลือกเปลี่ยน
  const handleFilterChange = (name, value) =>
    setFilters((prev) => ({ ...prev, [name]: value }));

  // รีเซ็ตฟิลเตอร์กลับเป็นค่าเริ่มต้น
  const resetFilters = () =>
    setFilters({ status: '', assignee_id: '', sort_by: 'updated_at', sort_order: 'DESC' });

  // ดึงรายชื่อผู้ใช้ที่เป็น staff หรือ admin สำหรับใช้ในฟิลเตอร์
  const fetchStaffAndAdminUsers = useCallback(async () => {
    try {
      const data = await userService.getAllUsers({ limit: 200 });
      const staff = data.users.filter((u) => ['staff', 'admin'].includes(u.role));
      setStaffList(staff);
    } catch {
      toast.error('โหลดรายชื่อผู้รับผิดชอบล้มเหลว');
    }
  }, []);

  // โหลด ticket จาก backend ตามฟิลเตอร์และหน้าปัจจุบัน
  const fetchTickets = useCallback(async (page = 1) => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const query = { page, limit: 10, ...filters };
      // ลบ key ที่ไม่ได้เลือกออกจาก query
      Object.keys(query).forEach((k) => query[k] === '' && delete query[k]);

      const res = await ticketService.getAllTickets(query);
      setTickets((prev) => [...prev, ...(res.tickets || [])]);
      setHasMore(page < (res.totalPages || 1));
      setCurrentPage(page);
    } catch (err) {
      toast.error(err.message || 'โหลดข้อมูลล้มเหลว');
    } finally {
      setIsLoading(false);
    }
  }, [filters, isLoading, hasMore]);

  // โหลดข้อมูลเมื่อ filters เปลี่ยน
  useEffect(() => {
    fetchStaffAndAdminUsers(); // โหลดรายชื่อผู้รับผิดชอบ
    setTickets([]); // ล้างรายการ
    setCurrentPage(1);
    setHasMore(true);
    fetchTickets(1); // โหลดหน้าแรกใหม่
  }, [filters]);

  // ดัก scroll ถึงท้าย list เพื่อโหลดหน้าใหม่
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchTickets(currentPage + 1);
      }
    });
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect(); // ยกเลิก observer เมื่อออกจากหน้า
  }, [fetchTickets, hasMore, currentPage]);

  return (
    <div className="ticket-list-page">
      <Title level={3}>รายการแจ้งปัญหาทั้งหมด</Title>

      {/* ส่ง isAdmin เข้า TicketFilter เพื่อให้เฉพาะ admin เห็น filter ผู้รับผิดชอบ */}
      <TicketFilter
        filters={filters}
        isAdmin={isAdmin} // ส่ง isAdmin ไปเพื่อให้แสดง dropdown ผู้รับผิดชอบเฉพาะ admin
        staffList={staffList}
        onChange={handleFilterChange}
        onReset={resetFilters}
      />

      {/* แสดงข้อความถ้าไม่มี ticket */}
      {tickets.length === 0 && !isLoading && (
        <p className="empty-text">ไม่พบรายการแจ้งปัญหา</p>
      )}

      {/* แสดงรายการ ticket ทั้งหมด */}
      <div className="ticket-grid-1">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.ticket_id} ticket={ticket} />
        ))}
      </div>

      {/* จุดสังเกตสำหรับ observer */}
      <div ref={observerRef} style={{ height: 20 }} />

      {/* แสดง spinner ขณะโหลด */}
      {isLoading && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Spin size="small" />
          <div style={{ marginTop: 12, color: '#555' }}>กำลังโหลดข้อมูล...</div>
        </div>
      )}
    </div>
  );
};

export default TicketListPage;
