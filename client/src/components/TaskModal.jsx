// client/src/components/TaskModal.jsx
import React, { useEffect, useState } from 'react';
import { Modal, List, Spin, Alert } from 'antd';
import statsService from '../services/staffService';

const TaskModal = ({ visible, staff, onClose }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible && staff?.user_id) {
      setLoading(true);
      setError('');
      statsService.getTasksByStaffId(staff.user_id)
        .then(setTasks)
        .catch(() => setError('เกิดข้อผิดพลาดในการโหลดงาน'))
        .finally(() => setLoading(false));
    }
  }, [visible, staff]);

  return (
    <Modal
      title={`📌 งานของ: ${staff?.full_name || '-'}`}
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      {/* โหลดข้อมูล */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin size="large" />
          <div style={{ marginTop: 12, color: '#555' }}>กำลังโหลดข้อมูล...</div>
        </div>
      ) : error ? (
        // แสดงข้อผิดพลาด
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ padding: 40 }}
        />
      ) : tasks.length === 0 ? (
        // กรณีไม่มีงาน
        <Alert
          message="ยังไม่มีงานที่รับ"
          type="info"
          showIcon
          style={{ padding: 40 }}
        />
      ) : (
        // แสดงรายการงาน
        <List
          dataSource={tasks}
          renderItem={(item) => (
            <List.Item>
              <b>#{item.ticket_id}</b>: {item.title}
            </List.Item>
          )}
        />
      )}
    </Modal>
  );
};

export default TaskModal;
