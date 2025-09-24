import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main.css';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// แสดง backend URL บน console
console.log('🔌 Connecting to backend:', process.env.REACT_APP_BACKEND_URL);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // ปิด React.StrictMode ชั่วคราวเพื่อไม่ให้ useEffect และ console.log ถูกเรียกซ้ำ 2 ครั้งตอน dev
  // React.StrictMode ช่วยเตือนปัญหาในโค้ด แต่มันทำให้ dev log เยอะเกินไป
  // ถ้าพัฒนาเสร็จหรืออยากให้ React ช่วยเช็คความถูกต้องมากขึ้น ค่อยเปิดกลับมาได้ #จำไว้
  // <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  // </React.StrictMode>
);
