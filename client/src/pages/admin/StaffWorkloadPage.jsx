import React, { useEffect, useState } from 'react';
import { Table, Typography, Pagination, Spin, Alert } from 'antd';
import staffService from '../../services/staffService';
import TaskModal from '../../components/TaskModal';

const { Title } = Typography;
const limit = 10;

const StaffWorkloadPage = () => {
  const [data, setData] = useState([]); // รายชื่อพนักงานพร้อมจำนวนงาน
  const [page, setPage] = useState(1); // หน้าปัจจุบันของ pagination
  const [loading, setLoading] = useState(true); // สถานะโหลดข้อมูล
  const [error, setError] = useState(''); // ข้อผิดพลาด

  const [selectedStaff, setSelectedStaff] = useState(null); // เก็บข้อมูลพนักงานที่เลือกเพื่อเปิด modal

  useEffect(() => {
    staffService.getStaffWorkload()
      .then((res) => {
        if (!Array.isArray(res)) throw new Error();
        setData(res);
      })
      .catch(() => setError('เกิดข้อผิดพลาดในการโหลดข้อมูล'))
      .finally(() => setLoading(false));
  }, []);

  // คอลัมน์ของตาราง รวมปุ่ม "ดูงาน"
  const columns = [
    { title: 'ชื่อพนักงาน', dataIndex: 'full_name' },
    { title: 'เบอร์โทรศัพท์', dataIndex: 'phone', render: v => v || '-' },
    { title: 'จำนวนงานที่รับ', dataIndex: 'ticket_count' },
    {
      title: '', // คอลัมน์สำหรับปุ่ม "ดูงาน"
      render: (_, record) => (
        <button
          type="button"
          onClick={() => setSelectedStaff(record)}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            margin: 0,
            color: '#1677ff',
            textDecoration: 'underline',
            cursor: 'pointer'
          }}
        >
          ดูงาน
        </button>
      )
    }
  ];

  // กรองข้อมูลเฉพาะหน้าที่เลือก
  const paginated = data.slice((page - 1) * limit, page * limit);

  return (
    <div style={{ padding: 24 }}>
      {/* ปรับ padding แบบ responsive ด้วย clamp() และเพิ่ม responsive shadow + radius */}
      <div
        style={{
          background: '#fff',
          padding: 'clamp(16px, 5vw, 24px)',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        {/* ใช้ clamp() เพื่อให้หัวเรื่องปรับขนาดอัตโนมัติตามจอ */}
        <Title level={3} style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)' }}>
          📋 จำนวนงานที่รับของพนักงาน
        </Title>

        {/* โหลดข้อมูล */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin size="large" />
            <div style={{ marginTop: 12, color: '#555' }}>กำลังโหลดข้อมูล...</div>
          </div>
        ) : error ? (
          // แสดงข้อผิดพลาด
          <Alert message={error} type="error" showIcon style={{ padding: 40 }} />
        ) : (
          <>
            {/* ห่อ Table ด้วย div เพื่อให้ scroll ซ้ายขวาได้บนจอแคบ */}
            <div style={{ overflowX: 'auto' }}>
              <Table
                dataSource={paginated}
                columns={columns}
                rowKey="user_id"
                pagination={false}
              />
            </div>

            {/* แสดง pagination หากข้อมูลเกิน limit */}
            {data.length > limit && (
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <Pagination
                  current={page}
                  pageSize={limit}
                  total={data.length}
                  onChange={setPage}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        )}

        {/* แสดง modal รายงานงานของพนักงานเมื่อกด "ดูงาน" */}
        <TaskModal
          visible={!!selectedStaff}
          staff={selectedStaff}
          onClose={() => setSelectedStaff(null)}
        />
      </div>
    </div>
  );
};

export default StaffWorkloadPage;
