import React from 'react';

// ตรวจว่าไฟล์เป็นประเภทอื่นที่ไม่ใช่รูป/วิดีโอ
const isOtherFile = f => !/\.(jpg|jpeg|png|gif|webp|mp4|mov|webm|avi)$/i.test(f.file_name);

// Component สำหรับแสดงไฟล์แนบประเภทเอกสารหรือไฟล์อื่นๆ
const FileAttachments = ({ attachments = [], apiBase }) => {
  const files = attachments.filter(isOtherFile);
  if (files.length === 0) return null; // ถ้าไม่มีไฟล์อื่นๆ ก็ไม่ต้องแสดง

  return (
    <div className="ticket-attachments">
      <h4 className="ticket-section-title">ไฟล์แนบ (เอกสาร / ไฟล์อื่น ๆ)</h4>
      <ul className="ticket-file-list">
        {files.map((f, i) => (
          <li key={i}>
            <a
              href={`${apiBase}${f.file_path}`}
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              📄 {f.file_name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileAttachments;
