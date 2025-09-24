// import api from './api'; // axios instance

// // แจ้งเตือนผู้ใช้เมื่อสถานะ Ticket เปลี่ยนผ่าน LINE
// export const notifyStatusChange = async (ticketId, status) => {
//   try {
//     const response = await api.post(`/tickets/${ticketId}/notify-status`, { status });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || new Error('ไม่สามารถแจ้งเตือนสถานะได้');
//   }
// };
