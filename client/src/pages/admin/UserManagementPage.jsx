import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Typography, Pagination, Space, Spin, message, Alert } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import userService from '../../services/userService';
import UserFormModal from '../../components/UserFormModal';

const { Title } = Typography;
const limit = 5;

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { users } = await userService.getAllUsers();
        setUsers(users || []);
        setError(''); // ล้าง error ถ้าโหลดสำเร็จ
      } catch {
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล'); // แสดงข้อความ error ถ้าโหลดล้มเหลว
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // ฟังก์ชันยืนยันลบผู้ใช้งาน
  const confirmDelete = async (user) => {
    const { isConfirmed } = await Swal.fire({
      title: `ลบ "${user.username}" หรือไม่?`,
      text: 'หากลบแล้วจะไม่สามารถย้อนกลับได้',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ลบเลย',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#d33',
    });
    if (!isConfirmed) return;

    try {
      await userService.deleteUserByAdmin(user.user_id);
      message.success(`ลบ "${user.username}" แล้ว`);
      setUsers((prev) => prev.filter((u) => u.user_id !== user.user_id));
    } catch {
      message.error('ลบผู้ใช้งานล้มเหลว');
    }
  };

  // กำหนด column สำหรับ Table โดยใช้ภาษาไทย render fallback
  const columns = [
    { title: 'ลำดับ', render: (_, __, i) => (page - 1) * limit + i + 1 },
    { title: 'รหัสผู้ใช้', dataIndex: 'user_id' },
    { title: 'ชื่อผู้ใช้', dataIndex: 'username', render: (v) => v || 'N/A' },
    { title: 'อีเมล', dataIndex: 'email', render: (v) => v || 'N/A' },
    { title: 'ชื่อ-นามสกุล', dataIndex: 'full_name', render: (v) => v || 'N/A' },
    { title: 'เบอร์โทรศัพท์', dataIndex: 'phone', render: (v) => v || 'N/A' },
    { title: 'Line ID', dataIndex: 'line_user_id', render: (v) => v || 'N/A' }, // เพิ่ม fallback ถ้าไม่มีค่า
    {
      title: 'บทบาท',
      dataIndex: 'role',
      render: (r) => {
        // กำหนดสี tag ตามบทบาท
        const color =
          r === 'admin' ? 'red' :
          r === 'staff' ? 'green' :
          r === 'requester' ? 'blue' :
          'gray';

        // กำหนด label ขึ้นต้นตัวใหญ่
        const label =
          r === 'admin' ? 'Admin' :
          r === 'staff' ? 'Staff' :
          r === 'requester' ? 'Requester' :
          'Unknown';

        return <Tag color={color}>{label}</Tag>;
      }
    },
    {
      title: 'อัปเดตล่าสุด',
      dataIndex: 'updated_at',
      render: (ts) => ts ? new Date(ts).toLocaleDateString('th-TH') : 'N/A',
    },
    {
      title: 'การจัดการ',
      render: (_, user) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => { setEditingUser(user); setModalOpen(true); }} />
          <Button icon={<DeleteOutlined />} danger onClick={() => confirmDelete(user)} />
        </Space>
      ),
    },
  ];

  const paginated = users.slice((page - 1) * limit, page * limit);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Space style={{ justifyContent: 'space-between', width: '100%', marginBottom: 16 }}>
          <Title level={3} style={{ margin: 0 }}>จัดการผู้ใช้งาน</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingUser(null); setModalOpen(true); }}>
            เพิ่มผู้ใช้ใหม่
          </Button>
        </Space>

        {/* แสดง loading หรือ error หรือ table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin size="large" />
            <div style={{ marginTop: 12, color: '#555' }}>กำลังโหลดข้อมูล...</div>
          </div>
        ) : error ? (
          <Alert message={error} type="error" showIcon style={{ padding: 40 }} />
        ) : (
          <>
            <Table
              dataSource={paginated}
              columns={columns}
              rowKey="user_id"
              pagination={false}
              scroll={{ x: 'max-content' }}
              // locale={{ emptyText: 'ไม่มีผู้ใช้งานในระบบ' }} // แสดงข้อความเมื่อไม่มีข้อมูล
            />
            {users.length > limit && (
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <Pagination
                  current={page}
                  pageSize={limit}
                  total={users.length}
                  onChange={setPage}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal สำหรับเพิ่ม/แก้ไขผู้ใช้งาน */}
      {modalOpen && (
        <UserFormModal
          user={editingUser}
          onClose={() => setModalOpen(false)}
          onSaveSuccess={async () => {
            setModalOpen(false);
            setLoading(true);
            try {
              const { users } = await userService.getAllUsers();
              setUsers(users || []);
            } finally {
              setLoading(false);
            }
          }}
        />
      )}
    </div>
  );
};

export default UserManagementPage;
