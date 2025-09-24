// client/src/services/reportService.js
import api from './api'; // ใช้ instance เดิมที่ตั้ง baseURL และ token ไว้แล้ว

// ดึงข้อมูลภาพรวม dashboard
const getSummary = async () => {
  const response = await api.get('/reports/dashboard/summary');
  return response.data;
};

// ดาวน์โหลดรายงาน ticket
const downloadReport = async () => {
  const response = await api.get('/reports/tickets', {
    responseType: 'blob', // สำคัญ! เพื่อให้โหลดเป็นไฟล์
  });
  return response.data;
};

// export แบบ default object
export default {
  getSummary,
  downloadReport
};
