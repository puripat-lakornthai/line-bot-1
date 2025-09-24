// client/src/components/StatusBadge.jsx
import React from 'react';

const StatusBadge = ({ status }) => {
  const statusMap = {
    new: 'ใหม่',
    assigned: 'มอบหมายแล้ว',
    in_progress: 'กำลังดำเนินการ',
    pending: 'รอข้อมูลเพิ่มเติม',
    resolved: 'แก้ไขแล้ว',
    closed: 'ปิดงานแล้ว',
  };

  const statusText = statusMap[status] || status;

  const statusStyles = {
    new: { backgroundColor: '#4caf50', color: '#fff' }, // สีเขียว
    assigned: { backgroundColor: '#ff9800', color: '#fff' }, // สีส้ม
    in_progress: { backgroundColor: '#2196f3', color: '#fff' }, // สีฟ้า
    pending: { backgroundColor: '#9e9e9e', color: '#fff' }, // สีเทา
    resolved: { backgroundColor: '#8bc34a', color: '#fff' }, // สีเขียวอ่อน
    closed: { backgroundColor: '#f44336', color: '#fff' }, // สีแดง
  };

  const badgeStyle = statusStyles[status] || { backgroundColor: '#888', color: '#fff' };

  return (
    <span className="status-badge" style={{ ...badgeStyle, padding: '0.5rem 1rem', borderRadius: '12px', fontWeight: 600, textTransform: 'capitalize', textAlign: 'center', minWidth: '100px', fontSize: '1rem' }}>
      {statusText}
    </span>
  );
};

export default StatusBadge;
