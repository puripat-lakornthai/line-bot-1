// // src/utils/devLog.js

// // ใช้ NODE_ENV มันจะมีค่าให้โดยอัตโนมัติ ตามคำสั่งที่รัน ถ้าลืมไปอ่าน readme
// // === 'development' คือเป็นการ "ตรวจสอบว่าอยู่ในโหมดพัฒนา (development mode)" 

// // debugLog: ใช้สำหรับ log ข้อมูลเชิงเทคนิค เช่น token, header, config, response detail
// // เหมาะกับข้อมูลที่ไม่ควรแสดงใน production
// const debugLog = (...args) => {
//   if (process.env.NODE_ENV === 'development') {
//     console.log('ข้อมูล debug เฉพาะ dev');
//     console.debug(...args);
//   }
// };

// // devLog: ใช้สำหรับ log ทั่วไป เช่น สถานะการทำงานของฟังก์ชัน เช่น "Login success"
// // สำหรับตรวจ flow การทำงานใน dev mode
// const devLog = (...args) => {
//   if (process.env.NODE_ENV === 'development') {
//     console.log('ข้อมูล debug เฉพาะ dev');
//     console.log(...args);
//   }
// };

// // devError: ใช้สำหรับ log ข้อผิดพลาด เช่น error.message, response.data.error
// // ใช้ใน try/catch หรือ callback ที่ error
// const devError = (...args) => {
//   if (process.env.NODE_ENV === 'development') {
//     console.log('ข้อมูล debug เฉพาะ dev');
//     console.error(...args);
//   }
// };

// // export เป็น object ชื่อเดียว เพื่อให้เรียกใช้แบบ log.devLog(), log.devError(), log.debugLog()
// const log = {
//   debugLog,
//   devLog,
//   devError,
// };

// export default log;
