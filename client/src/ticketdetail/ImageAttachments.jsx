import React, { useState, useRef } from 'react';

// ฟังก์ชันช่วยเช็คว่าไฟล์เป็นภาพหรือไม่ จากนามสกุล
const isImage = f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f.file_name);

const ImageAttachments = ({ attachments = [], apiBase }) => {
  const images = attachments.filter(isImage);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const thumbRef = useRef();

  if (images.length === 0) return null;

  const scrollToIndex = (index) => {
    thumbRef.current?.children?.[index]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
    });
  };

  const handleThumbnailClick = (i) => {
    setSelectedIndex(i);
    scrollToIndex(i);
    setLightboxOpen(true);
  };

  const handleScrollNav = (direction) => {
    const newIndex = (selectedIndex + direction + images.length) % images.length;
    setSelectedIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const handleLightboxNav = (direction) => {
    const newIndex = (selectedIndex + direction + images.length) % images.length;
    setSelectedIndex(newIndex);
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
    scrollToIndex(selectedIndex);
  };

  const current = images[selectedIndex];

  return (
    <div className="image-attachments">
      <h4 className="image-section-title">ไฟล์แนบ (รูปภาพ)</h4>

      {current && (
        <div className="image-main-preview-container">
          <img
            src={`${apiBase}${current.file_path}`}
            alt="ภาพหลัก"
            className="image-main-preview"
            onClick={() => setLightboxOpen(true)}
          />
        </div>
      )}

      <div className="image-thumbnail-carousel">
        <button className="image-thumb-nav prev" onClick={() => handleScrollNav(-1)}>‹</button>
        <div className="image-thumbnail-scrollable" ref={thumbRef}>
          {images.map((f, i) => (
            <img
              key={i}
              src={`${apiBase}${f.file_path}`}
              className={`image-thumbnail ${i === selectedIndex ? 'active' : ''}`}
              onClick={() => handleThumbnailClick(i)}
              alt={`thumb-${i}`}
            />
          ))}
        </div>
        <button className="image-thumb-nav next" onClick={() => handleScrollNav(1)}>›</button>
      </div>

      {lightboxOpen && current && (
        <div className="image-lightbox-overlay" onClick={handleCloseLightbox}>
          <div className="image-lightbox-inner" onClick={e => e.stopPropagation()}>
            <button className="image-lightbox-close" onClick={handleCloseLightbox}>×</button>
            <div className="image-lightbox-main-view">
              <button className="image-lightbox-nav prev" onClick={() => handleLightboxNav(-1)}>←</button>
              <img
                src={`${apiBase}${current.file_path}`}
                className="image-lightbox-image"
                alt={`image-${selectedIndex}`}
              />
              <button className="image-lightbox-nav next" onClick={() => handleLightboxNav(1)}>→</button>
            </div>
            <div className="image-lightbox-thumbnails">
              {images.map((f, i) => (
                <img
                  key={i}
                  src={`${apiBase}${f.file_path}`}
                  className={`image-lightbox-thumbnail ${i === selectedIndex ? 'active' : ''}`}
                  onClick={() => setSelectedIndex(i)}
                  alt={`thumb-${i}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageAttachments;
