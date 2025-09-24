// AdminDashboardPage.jsx
// หน้าหลักของผู้ดูแลระบบ แสดงข้อมูลภาพรวมและภาระงานพนักงาน พร้อมปุ่มดาวน์โหลดรายงาน
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../../contexts/AuthContext';
import reportService from '../../services/reportService';
import staffService from '../../services/staffService';
import { Row, Col, Card, Statistic, List, Button, Typography, Spin, Alert } from 'antd';
import { DownloadOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const AdminDashboardPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);
  const [workload, setWorkload] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // โหลดข้อมูลภาพรวมและภาระงาน
  const loadData = async () => {
    try {
      const [sumData, workData] = await Promise.all([
        reportService.getSummary(),
        staffService.getStaffWorkload()
      ]);
      setSummary(sumData);
      setWorkload(workData);
    } catch {
      setError('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  // ดาวน์โหลดรายงาน
  const handleDownload = async () => {
    try {
      const blob = await reportService.downloadReport();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ticket_report.xlsx');
      link.click();
    } catch {
      toast.error('ไม่สามารถดาวน์โหลดรายงานได้');
    }
  };

  useEffect(() => { loadData(); }, []);

  return (
    <div className="page-container">
      <Title level={3}>Admin Dashboard</Title>
      <Paragraph>สวัสดีคุณ {currentUser?.full_name || currentUser?.username} (ผู้ดูแลระบบ)!</Paragraph>
      <Paragraph>นี่คือหน้าแรกสำหรับจัดการระบบแจ้งปัญหา</Paragraph>
      <hr style={{ margin: '20px 0' }} />

      {/* โหลดข้อมูล / แสดง error */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin size="large" /><div style={{ marginTop: 12 }}>กำลังโหลดข้อมูล...</div>
        </div>
      ) : error ? (
        <Alert message={error} type="error" showIcon style={{ padding: 40 }} />
      ) : (
        <>
          {/* ข้อมูลภาพรวม */}
          <Title level={4}>📊 ข้อมูลภาพรวมระบบ</Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={6}><Card><Statistic title="Ticket ทั้งหมด" value={summary.total_tickets} /></Card></Col>
            <Col xs={24} sm={12} md={8} lg={6}><Card><Statistic title="ใหม่" value={summary.new_tickets} /></Card></Col>
            <Col xs={24} sm={12} md={8} lg={6}><Card><Statistic title="มอบหมายแล้ว" value={summary.assigned_tickets} /></Card></Col>
            <Col xs={24} sm={12} md={8} lg={6}><Card><Statistic title="รอดำเนินการ" value={summary.pending_tickets} /></Card></Col>
            <Col xs={24} sm={12} md={8} lg={6}><Card><Statistic title="กำลังดำเนินการ" value={summary.in_progress_tickets} /></Card></Col>
            <Col xs={24} sm={12} md={8} lg={6}><Card><Statistic title="แก้ไขแล้ว" value={summary.resolved_tickets} /></Card></Col>
            <Col xs={24} sm={12} md={8} lg={6}><Card><Statistic title="ปิดแล้ว" value={summary.closed_tickets} /></Card></Col>
            <Col xs={24} sm={12} md={8} lg={6}><Card><Statistic title="ผู้ใช้งานทั้งหมด" value={summary.total_users} prefix={<UserOutlined />} /></Card></Col>
          </Row>

          {/* ภาระงานพนักงาน */}
          <Title level={4} style={{ marginTop: 25 }}>📋 ภาระงานของพนักงาน</Title>
          {workload.length === 0 ? (
            <Text type="secondary">ไม่มีข้อมูลภาระงาน</Text>
          ) : (
            <List
              bordered size="small" dataSource={workload} style={{ maxWidth: 600 }}
              renderItem={(s) => (
                <List.Item>
                  <Text style={{ fontSize: 16 }}>👨‍💼 <strong>{s.full_name}</strong> - รับผิดชอบ <strong>{s.ticket_count}</strong> งาน</Text>
                </List.Item>
              )}
            />
          )}

          {/* ปุ่มดาวน์โหลด */}
          <Row justify="end" style={{ marginTop: 20 }}>
            <Col xs={24} sm="auto" style={{ textAlign: 'right' }}>
              <Button type="primary" icon={<DownloadOutlined />} size="large"
                onClick={handleDownload}
                style={{ backgroundColor: '#28a745', borderColor: '#28a745', width: '100%', maxWidth: 240 }}>
                ดาวน์โหลดรายงาน
              </Button>
            </Col>
          </Row>

          {/* ทางลัด */}
          <hr style={{ margin: '30px 0' }} />
          <Title level={4}>🧷 ทางลัดที่ใช้บ่อย</Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}><Link to="/admin/tickets" className="btn btn-primary" style={{ display: 'block', textAlign: 'center' }}>ดูรายการปัญหาทั้งหมด</Link></Col>
            <Col xs={24} sm={12} md={8}><Link to="/admin/staff-workload" className="btn btn-primary" style={{ display: 'block', textAlign: 'center' }}>ดูภาระงานของพนักงาน</Link></Col>
            <Col xs={24} sm={12} md={8}><Link to="/admin/users" className="btn btn-primary" style={{ display: 'block', textAlign: 'center' }}>จัดการผู้ใช้งาน</Link></Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default AdminDashboardPage;
