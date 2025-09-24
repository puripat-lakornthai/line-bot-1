import { Link } from 'react-router-dom';
import '../styles/NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="notfound-wrapper">
      <div className="notfound-card">
        <img
          src="/images/Gura404.gif" // ภาพ SVG จาก undraw
          alt="Page not found"
          className="notfound-illustration"
        />
        <h1 className="notfound-title">404 - ไม่พบหน้านี้</h1>
        <p className="notfound-description">
          หน้าที่คุณพยายามเข้าถึงอาจถูกลบหรือไม่มีอยู่ในระบบ
        </p>
        <Link to="/" className="notfound-button">
          กลับหน้าหลัก
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
