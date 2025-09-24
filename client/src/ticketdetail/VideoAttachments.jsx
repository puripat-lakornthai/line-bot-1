import React, { useState, useRef } from 'react';

const isVideo = f => /\.(mp4|mov|webm|avi)$/i.test(f.file_name);

const VideoAttachments = ({ attachments = [], apiBase }) => {
  const videos = attachments.filter(isVideo);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const thumbRef = useRef();

  if (videos.length === 0) return null;

  const handleLightboxNav = (direction) => {
    const newIndex = (activeIndex + direction + videos.length) % videos.length;
    setActiveIndex(newIndex);
  };

  const scrollToThumb = (index) => {
    thumbRef.current?.children?.[index]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center'
    });
  };

  const handleCarouselNav = (direction) => {
    const newIndex = (activeIndex + direction + videos.length) % videos.length;
    setActiveIndex(newIndex);
    scrollToThumb(newIndex);
  };

  return (
    <div className="video-attachments">
      <h4 className="ticket-section-title">ไฟล์แนบ (วิดีโอ)</h4>

      <div className="video-attachments-main-video">
        <video
          key={activeIndex}
          controls
          className="video-preview"
          preload="metadata"
          onClick={() => setLightboxOpen(true)}
        >
          <source src={`${apiBase}${videos[activeIndex].file_path}`} type="video/mp4" />
          วิดีโอนี้ไม่สามารถเล่นได้
        </video>
      </div>

      {videos.length > 1 && (
        <div className="video-thumbnails-carousel-container">
          <button className="video-thumb-nav prev" onClick={() => handleCarouselNav(-1)}>‹</button>
          <div className="video-thumbnails-scrollable" ref={thumbRef}>
            {videos.map((v, i) => (
              <video
                key={i}
                src={`${apiBase}${v.file_path}`}
                className={`video-thumbnail ${i === activeIndex ? 'active' : ''}`}
                onClick={() => {
                  setActiveIndex(i);
                  scrollToThumb(i);
                }}
                muted
                loop
                playsInline
              />
            ))}
          </div>
          <button className="video-thumb-nav next" onClick={() => handleCarouselNav(1)}>›</button>
        </div>
      )}

      {lightboxOpen && (
        <div className="video-lightbox-overlay" onClick={() => setLightboxOpen(false)}>
          <div className="video-lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button className="video-lightbox-close" onClick={() => setLightboxOpen(false)}>×</button>
            <div className="video-lightbox-main-view">
              <button className="video-lightbox-nav prev" onClick={() => handleLightboxNav(-1)}>←</button>
              <video
                key={activeIndex}
                controls
                className="video-lightbox-video"
                preload="metadata"
              >
                <source src={`${apiBase}${videos[activeIndex].file_path}`} type="video/mp4" />
              </video>
              <button className="video-lightbox-nav next" onClick={() => handleLightboxNav(1)}>→</button>
            </div>

            <div className="video-lightbox-thumbnails">
              {videos.map((v, i) => (
                <video
                  key={i}
                  src={`${apiBase}${v.file_path}`}
                  className={`video-lightbox-thumbnail ${i === activeIndex ? 'active' : ''}`}
                  onClick={() => setActiveIndex(i)}
                  muted
                  loop
                  playsInline
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoAttachments;
