// client/src/services/ticketService.js

import api from './api'; // axios instance ที่ตั้งค่า baseURL แล้ว

// สร้าง Ticket ใหม่
// ticketData: { title, description }
// files: FileList object จาก input[type="file"]
const createTicket = async (ticketData, files) => {
  const formData = new FormData();
  formData.append('title', ticketData.title);
  formData.append('description', ticketData.description);

  if (files && files.length > 0) {
    // ใช้ for...of เพื่อให้วนลูป FileList ได้อย่างถูกต้อง
    for (const file of files) {
      formData.append('attachments', file);
    }
  }

  try {
    const response = await api.post('/tickets', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('ไม่สามารถสร้าง Ticket ได้');
  }
};

// ดึงรายการ Ticket ทั้งหมด พร้อม filter + pagination
// params: { page, limit, status, assignee_id, ... }
const getAllTickets = async (params = {}) => {
  try {
    const response = await api.get('/tickets', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('ไม่สามารถดึงรายการ Ticket ได้');
  }
};

// ดึงข้อมูล Ticket รายตัวตาม ID
const getTicketById = async (ticketId) => {
  try {
    const response = await api.get(`/tickets/${ticketId}`);
    return response.data;
  } catch (error) {
    // throw error.response?.data || new Error('ไม่สามารถดึง Ticket ได้');
    throw error; // โยน error object ทั้งก้อนออกมา
  }
};

// มอบหมายผู้รับผิดชอบ (admin เท่านั้น)
// assignee: เป็น user_id เดี่ยว หรือ array ของ user_id
const assignTicket = async (ticketId, assignee) => {
  const payload = Array.isArray(assignee)
    ? { assignee_ids: assignee } // กรณีเลือกหลายคน
    : { assignee_id: assignee }; // กรณีเลือกคนเดียว

  try {
    const response = await api.put(`/tickets/${ticketId}/assign`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('ไม่สามารถมอบหมาย Ticket ได้');
  }
};

// อัปเดต Ticket เช่น เปลี่ยนสถานะ, แก้รายละเอียด, เพิ่มไฟล์แนบ
// updateData: { status, title, description }
// files: FileList จาก input[type="file"]
const updateTicket = async (ticketId, updateData, files) => {
  const formData = new FormData();

  Object.keys(updateData).forEach(key => {
    const value = updateData[key];
    if (value === null || value === '') {
      formData.append(key, ''); // ถ้าเป็น string ว่าง
    } else if (value !== undefined) {
      formData.append(key, value);
    }
  });

  if (files && files.length > 0) {
    for (const file of files) {
      formData.append('attachments', file);
    }
  }

  try {
    const response = await api.put(`/tickets/${ticketId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('ไม่สามารถอัปเดต Ticket ได้');
  }
};

// ลบ Ticket ตาม ID
const deleteTicket = async (ticketId) => {
  try {
    const response = await api.delete(`/tickets/${ticketId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('ไม่สามารถลบ Ticket ได้');
  }
};

// รวมฟังก์ชันทั้งหมดไว้ในตัวแปรเดียวสำหรับ export
export default {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  assignTicket,
};
