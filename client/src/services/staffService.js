import api from './api';

// ดึงจำนวน ticket ที่พนักงานแต่ละคนรับผิดชอบ
const getStaffWorkload = async () => {
  try {
    const response = await api.get('/stats/staff-workload');
    return response.data; // คืน array ของ { user_id, full_name, ticket_count }
  } catch (error) {
    console.error('Error fetching staff workload:', error);
    throw error;
  }
};

// ดึงรายการงาน (ticket) ที่พนักงานแต่ละคนรับผิดชอบ
const getTasksByStaffId = async (userId) => {
  try {
    const response = await api.get(`/stats/${userId}/tasks`);
    return response.data; // สมมติ backend คืน array ตรง ๆ [{ ticket_id, title }, ...]
  } catch (error) {
    console.error('Error fetching tasks for staff:', error);
    return []; // ถ้า error คืน array ว่าง เพื่อให้ frontend แสดง "ไม่พบงาน"
  }
};

// export แบบ object
export default {
  getStaffWorkload,
  getTasksByStaffId,
};
