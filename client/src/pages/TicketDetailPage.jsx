import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Select, Spin, Alert } from 'antd';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import AuthContext from '../contexts/AuthContext';
import ticketService from '../services/ticketService';
import userService from '../services/userService';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import ImageAttachments from '../ticketdetail/ImageAttachments';
import VideoAttachments from '../ticketdetail/VideoAttachments';
import FileAttachments from '../ticketdetail/FileAttachments';
import '../styles/TicketDetailPage.css';

const { Option } = Select;

// ตัวเลือกสถานะทั้งหมดในระบบ
const statusOptions = [
  { value: 'new', label: 'ใหม่' },
  { value: 'assigned', label: 'มอบหมายแล้ว' },
  { value: 'pending', label: 'รอข้อมูลเพิ่มเติม' },
  { value: 'in_progress', label: 'กำลังดำเนินการ' },
  { value: 'resolved', label: 'แก้ไขแล้ว' },
  { value: 'closed', label: 'ปิดงาน' }
];

// แผนที่สถานะที่ staff เปลี่ยนได้ในแต่ละขั้น
const statusFlowMap = {
  new: ['assigned', 'pending'],
  assigned: ['in_progress', 'pending'],
  in_progress: ['resolved', 'pending'],
  pending: ['in_progress'],
  resolved: ['closed', 'in_progress'],
  closed: []
};

// คืนค่ารายการสถานะถัดไปที่เลือกได้
const getNextStatusOptions = curr =>
  statusOptions.filter(opt => (statusFlowMap[curr] || []).includes(opt.value));

const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const isAdmin = currentUser?.role === 'admin';
  // const isStaff = currentUser?.role === 'staff';
  const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

  const [ticket, setTicket] = useState(null);
  const [assignees, setAssignees] = useState([]);
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { if (id) loadTicket(); }, [id]);

  // ตรวจสอบสิทธิ์ของ staff หากไม่ได้รับมอบหมาย จะ redirect ออกจากหน้า
  // useEffect(() => {
  //   if (!ticket || isAdmin) return; // admin เข้าถึงได้ทุก ticket

  //   if (isStaff) {
  //     const isAssignedStaff = ticket.assignees?.some(a => a.user_id === currentUser.user_id);
  //     if (!isAssignedStaff) {
  //       toast.error('คุณไม่มีสิทธิ์เข้าถึง Ticket นี้');
  //       navigate('/my-tickets');
  //     }
  //   }
  // }, [ticket, currentUser, isAdmin, isStaff, navigate]);

  // โหลดข้อมูล ticket และ staff พร้อมกัน ***
  const loadTicket = async () => {
    try {
      const [t, staff] = await Promise.all([
        ticketService.getTicketById(id),
        userService.getAllStaff()
      ]);
      setTicket(t);
      setAssignees(staff);
      syncSelected(t, staff);
    } catch (err) {
      console.error('🔥 DEBUG ERR:', err);

      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err?.message || '';

      if (status === 403 || msg.includes('สิทธิ์') || msg.includes('ไม่ได้รับมอบหมาย')) {
        toast.error('คุณไม่มีสิทธิ์เข้าถึง Ticket นี้');
        // รอให้ toast แสดงก่อน
        setTimeout(() => navigate('/staff/my-tickets'), 1000);
      } else {
        toast.error('เกิดข้อผิดพลาดทั่วไป');
        setError('ไม่สามารถโหลดข้อมูล Ticket ได้');
      }
    } finally {
      setLoading(false);
    }
  };

  // โหลด ticket ใหม่เมื่อมีการอัปเดต
  const refresh = async () => {
    const t = await ticketService.getTicketById(id);
    setTicket(t);
    syncSelected(t, assignees);
  };

  // ซิงค์รายชื่อผู้รับผิดชอบ (ใน dropdown)
  const syncSelected = (t, staff) => {
    const selected = staff.filter(u =>
      t.assignees?.some(a => a.user_id === u.user_id)
    );
    setSelectedAssignees(selected.map(u => ({ value: u.user_id, label: u.full_name })));
  };

  // เปลี่ยนผู้รับผิดชอบทันทีเมื่อเปลี่ยน dropdown
  const handleAssigneeChange = async (newIds) => {
    const oldIds = ticket.assignees?.map(a => a.user_id) || [];
    const removed = oldIds.filter(id => !newIds.includes(id));
    const selected = assignees.filter(u => newIds.includes(u.user_id));
    setSelectedAssignees(selected.map(u => ({ value: u.user_id, label: u.full_name })));

    if (!removed.length) return; // ถ้าไม่มีการลบ ไม่ต้อง update

    try {
      await ticketService.assignTicket(id, newIds);
      if (!newIds.length) {
        await ticketService.updateTicket(id, { status: 'new' });
      } else if (ticket.status === 'new') {
        await ticketService.updateTicket(id, { status: 'assigned' });
      }
      await refresh();
      toast.success('ลบผู้รับผิดชอบแล้ว');
    } catch {
      toast.error('อัปเดตผู้รับผิดชอบล้มเหลว');
    }
  };

  // มอบหมายเมื่อกดปุ่ม
  const handleAssignConfirm = async () => {
    const ids = selectedAssignees.map(a => a.value);
    if (!ids.length) return toast.warn('กรุณาเลือกผู้รับผิดชอบ');

    try {
      await ticketService.assignTicket(id, ids);
      if (ticket.status === 'new') {
        await ticketService.updateTicket(id, { status: 'assigned' });
      }
      await refresh();
      toast.success('มอบหมายงานสำเร็จ');
    } catch {
      toast.error('มอบหมายงานล้มเหลว');
    }
  };

  // เปลี่ยนสถานะ Ticket
  const handleStatusChange = async (value) => {
    try {
      await ticketService.updateTicket(id, { status: value });
      await refresh();
      toast.success('อัปเดตสถานะแล้ว');
    } catch {
      toast.error('อัปเดตสถานะไม่สำเร็จ');
    }
  };

  // ยืนยันลบ Ticket
  const handleDelete = async () => {
    const res = await Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: 'เมื่อลบแล้วจะไม่สามารถกู้คืนได้',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ลบเลย',
      cancelButtonText: 'ยกเลิก'
    });
    if (!res.isConfirmed) return;

    try {
      await ticketService.deleteTicket(ticket.ticket_id);
      toast.success('ลบ Ticket สำเร็จ');
      navigate('/admin/tickets');
    } catch (err) {
      toast.error(err.message || 'ลบ Ticket ไม่สำเร็จ');
    }
  };

  // แสดงสถานะโหลดหรือ error
  if (loading) return <div style={{ textAlign: 'center', padding: 40 }}><Spin size="large" /><div style={{ marginTop: 12 }}>กำลังโหลดข้อมูล...</div></div>;
  if (error) return <Alert message={error} type="error" showIcon style={{ padding: 40 }} />;
  if (!ticket) return null;

  // เตรียม options สำหรับ select assignee
  const assigneeOptions = assignees.map(u => ({ value: u.user_id, label: u.full_name }));
  const statusChoices = isAdmin ? statusOptions : getNextStatusOptions(ticket.status);

  return (
    <div className="ticket-page-container">
      {/* ส่วนหัวของ Ticket */}
      <div className="ticket-header">
        <div className="ticket-title-group">
          <h2 className="ticket-title">
            แจ้งปัญหาจาก {ticket.title}
            <span className="ticket-id">#{ticket.ticket_id}</span>
          </h2>
        </div>
        <div className="ticket-action-group">
          <StatusBadge status={ticket.status} />
          {isAdmin && <button className="btn-delete-ticket" onClick={handleDelete}>ลบ Ticket</button>}
        </div>
      </div>

      {/* รายละเอียด Ticket */}
      <div className="ticket-grid">
        <div className="ticket-main">
          <h4 className="ticket-section-title">รายละเอียดปัญหา</h4>
          <p>{ticket.description || 'ไม่มีรายละเอียด'}</p>
          <ImageAttachments attachments={ticket.attachments} apiBase={API_BASE} />
          <VideoAttachments attachments={ticket.attachments} apiBase={API_BASE} />
          <FileAttachments attachments={ticket.attachments} apiBase={API_BASE} />
        </div>

        {/* ข้อมูลเพิ่มเติมของ Ticket */}
        <div className="ticket-sidebar">
          <h4 className="ticket-section-title">ข้อมูล Ticket</h4>
          <ul className="ticket-info-list">
            <li><strong>สถานะ:</strong> <StatusBadge status={ticket.status} /></li>
            <li><strong>ความสำคัญ:</strong> <PriorityBadge priority={ticket.priority} /></li>
            <li><strong>ผู้แจ้ง:</strong> {ticket.requester_fullname || 'N/A'}</li>
            <li><strong>สร้างเมื่อ:</strong> {new Date(ticket.created_at).toLocaleString('th-TH')}</li>
            <li><strong>อัปเดตล่าสุด:</strong> {new Date(ticket.updated_at).toLocaleString('th-TH')}</li>
            <li><strong>ผู้รับผิดชอบ:</strong> {ticket.assignees?.map(a => a.full_name).join(', ') || 'ยังไม่มอบหมาย'}</li>
          </ul>

          {/* ส่วนมอบหมายพนักงาน */}
          {isAdmin && (
            <>
              <label>เลือกผู้รับผิดชอบ:</label>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="เลือกพนักงาน..."
                value={selectedAssignees.map(a => a.value)}
                onChange={handleAssigneeChange}
              >
                {assigneeOptions.map(opt => (
                  <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                ))}
              </Select>
              <button className="btn-assign success" onClick={handleAssignConfirm}>มอบหมาย</button>
            </>
          )}

          {/* แก้ไขสถานะ */}
          <div className="ticket-status-edit" style={{ marginTop: 16 }}>
            <label>เปลี่ยนสถานะ:</label>
            <Select
              style={{ width: '100%' }}
              value={{
                value: ticket.status,
                label: statusOptions.find(opt => opt.value === ticket.status)?.label || ticket.status
              }}
              onChange={(selected) => handleStatusChange(selected.value)}
              labelInValue
              disabled={!isAdmin && statusChoices.length === 0}
            >
              {statusChoices.map(opt => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
