import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import { getToken, isTokenExpired } from '../utils/authUtils';
import { toast } from 'react-toastify';
// CSS ของ ToastContainer import ใน App.js หรือ index.js ไว้แล้ว

const LoginPage = () => {
  const [identifier, setIdentifier]   = useState('');
  const [password,   setPassword]     = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  const { login, currentUser, loading } = useContext(AuthContext);
  const navigate  = useNavigate();

  // ถ้ามี user → redirect ตาม role
  useEffect(() => {
    const token = getToken();
    if (!loading && currentUser && !isTokenExpired(token)) {
      if (currentUser.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (currentUser.role === 'staff') {
        navigate('/staff/dashboard', { replace: true });
      } else {
        toast.error('บัญชีนี้ไม่มีสิทธิ์เข้าใช้งานระบบ กรุณาติดต่อผู้ดูแล');
      }
    }
  }, [currentUser, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    toast.dismiss();

    if (!identifier || !password) {
      toast.error('กรอกอีเมล/ชื่อผู้ใช้ และรหัสผ่าน');
      return;
    }

    setSubmitting(true);

    try {
      await login({ identifier, password });
      toast.success('เข้าสู่ระบบสำเร็จ');
      // useEffect ด้านบนจะ redirect ให้อัตโนมัติ
    } catch (err) {
      const msg =
        (err && err.error) ||
        err.message ||
        'เกิดข้อผิดพลาดระหว่างเข้าสู่ระบบ';
      toast.error(msg);
      console.error('Login failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '450px' }}>
      <h2>Login to My Helpdesk</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="identifier">Email หรือ Username:</label>
          <input
            id="identifier"
            type="text"
            placeholder="กรอกอีเมลหรือชื่อผู้ใช้"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            placeholder="กรอกรหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
