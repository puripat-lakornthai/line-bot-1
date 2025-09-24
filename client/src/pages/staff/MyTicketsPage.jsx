import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Spin, Alert, Pagination, Typography } from 'antd';
import ticketService from '../../services/ticketService';
import TicketCard from '../../components/TicketCard';
import TicketFilter from '../../components/TicketFilter';
import AuthContext from '../../contexts/AuthContext';
import '../../styles/TicketListPage.css';

const { Title } = Typography;

const MyTicketsPage = () => {
  const { currentUser } = useContext(AuthContext);

  const [tickets, setTickets] = useState([]);
  const [filters, setFilters] = useState({
    status: '', sort_by: 'updated_at', sort_order: 'DESC'
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotal] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ฟังก์ชันโหลด ticket เฉพาะของ staff ปัจจุบัน
  const fetchTickets = useCallback(async (pageNum = 1) => {
    setLoading(true);
    setError('');

    try {
      const query = {
        page: pageNum,
        limit: 10,
        ...filters,
        assignee_id: currentUser.user_id
      };
      Object.keys(query).forEach(k => query[k] === '' && delete query[k]);

      const res = await ticketService.getAllTickets(query);
      setTickets(res.tickets || []);
      setTotal(res.totalPages || 1);
      setPage(pageNum);
    } catch {
      setError('เกิดข้อผิดพลาดในการโหลด Ticket');
    } finally {
      setLoading(false);
    }
  }, [filters, currentUser]);

  // โหลดข้อมูลเมื่อ filters หรือ page เปลี่ยน
  useEffect(() => {
    if (currentUser) {
      fetchTickets(page);
    }
  }, [filters, page, currentUser, fetchTickets]);

  // เปลี่ยนค่าตัวกรอง
  const handleChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  // รีเซ็ตค่าตัวกรอง
  const resetFilters = () => {
    setFilters({ status: '', sort_by: 'updated_at', sort_order: 'DESC' });
  };

  if (!currentUser) {
    return <div className="page-container"><Alert message="กรุณาเข้าสู่ระบบ" type="warning" showIcon /></div>;
  }
  if (error) {
    return <div className="page-container"><Alert message={error} type="error" showIcon /></div>;
  }

  return (
    <div className="page-container">
      <Title level={3}>รายการ Ticket ที่รับผิดชอบ</Title>

      {/* กรอง ticket เฉพาะของ staff */}
      <TicketFilter
        filters={filters}
        onChange={handleChange}
        onReset={resetFilters}
      />

      {loading && tickets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin size="large" />
          <div style={{ marginTop: 12, color: '#555' }}>กำลังโหลดข้อมูล...</div>
        </div>
      ) : tickets.length === 0 ? (
        <p>ไม่มี Ticket ที่ตรงกับตัวกรอง</p>
      ) : (
        tickets.map(t => <TicketCard key={t.ticket_id} ticket={t} />)
      )}

      {totalPages > 1 && (
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Pagination
            current={page}
            total={totalPages * 10}
            pageSize={10}
            onChange={setPage}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};

export default MyTicketsPage;
