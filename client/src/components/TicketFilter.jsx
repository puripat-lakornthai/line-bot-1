// src/components/TicketFilter.jsx
import React from 'react';
import { Row, Col, Select, Button, Card } from 'antd';

const { Option } = Select;

const TicketFilter = ({ filters, isAdmin, staffList, onChange, onReset }) => {
  const options = {
    status: [
      { value: '', label: 'ทุกสถานะ' },
      { value: 'new', label: 'ใหม่' },
      { value: 'assigned', label: 'มอบหมายแล้ว' },
      { value: 'in_progress', label: 'กำลังดำเนินการ' },
      { value: 'pending', label: 'รอข้อมูลเพิ่มเติม' },
      { value: 'resolved', label: 'แก้ไขแล้ว' },
      { value: 'closed', label: 'ปิดงานแล้ว' },
    ],
    sort_by: [
      { value: 'updated_at', label: 'วันที่อัปเดตล่าสุด' },
      { value: 'created_at', label: 'เรียงตามวันที่สร้าง' },
    ],
    sort_order: [
      { value: 'DESC', label: 'ใหม่ไปเก่า' },
      { value: 'ASC', label: 'เก่าไปใหม่' },
    ],
  };

  return (
    <Card
      title="ตัวกรองรายการแจ้งปัญหา"
      bordered={false}
      style={{ marginBottom: 24 }}
    >
      <Row gutter={[16, 16]}>
        {/* สถานะ */}
        <Col xs={24} sm={12} md={6}>
          <label style={{ display: 'block', marginBottom: 4 }}>สถานะ</label>
          <Select
            value={filters.status}
            onChange={(v) => onChange('status', v)}
            style={{ width: '100%' }}
            placeholder="เลือกสถานะ"
          >
            {options.status.map((o) => (
              <Option key={o.value} value={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
        </Col>

        {/* เรียงตาม */}
        <Col xs={24} sm={12} md={6}>
          <label style={{ display: 'block', marginBottom: 4 }}>เรียงตาม</label>
          <Select
            value={filters.sort_by}
            onChange={(v) => onChange('sort_by', v)}
            style={{ width: '100%' }}
          >
            {options.sort_by.map((o) => (
              <Option key={o.value} value={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
        </Col>

        {/* ลำดับ */}
        <Col xs={24} sm={12} md={6}>
          <label style={{ display: 'block', marginBottom: 4 }}>ลำดับ</label>
          <Select
            value={filters.sort_order}
            onChange={(v) => onChange('sort_order', v)}
            style={{ width: '100%' }}
          >
            {options.sort_order.map((o) => (
              <Option key={o.value} value={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
        </Col>

        {/* ผู้รับผิดชอบ (แสดงเฉพาะ admin) */}
        {isAdmin && (
          <Col xs={24} sm={12} md={6}>
            <label style={{ display: 'block', marginBottom: 4 }}>ผู้รับผิดชอบ</label>
            <Select
              value={filters.assignee_id}
              onChange={(v) => onChange('assignee_id', v)}
              style={{ width: '100%' }}
              allowClear
              placeholder="เลือกผู้รับผิดชอบ"
            >
              <Option value="">ทั้งหมด</Option>
              <Option value="null">ยังไม่มอบหมาย</Option>
              {staffList.map((s) => (
                <Option key={s.user_id} value={s.user_id}>
                  {s.full_name || s.username}
                </Option>
              ))}
            </Select>
          </Col>
        )}
      </Row>

      {/* ปุ่มรีเซ็ต */}
      <Row justify="end" style={{ marginTop: 16 }}>
        <Col>
          <Button onClick={onReset}>รีเซ็ตตัวกรอง</Button>
        </Col>
      </Row>
    </Card>
  );
};

export default TicketFilter;
