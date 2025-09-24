import React from 'react';

const PriorityBadge = ({ priority }) => {
  const normalized = priority?.toLowerCase?.() || 'medium';

  const styleMap = {
    high:   { backgroundColor: '#e53e3e', color: 'white' }, // แดง
    medium: { backgroundColor: '#ed8936', color: 'white' }, // ส้ม
    low:    { backgroundColor: '#38a169', color: 'white' }, // เขียว
  };

  const priorityStyle = {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '999px',
    fontSize: '0.9rem',
    fontWeight: 600,
    ...styleMap[normalized],
  };

  return (
    <span style={priorityStyle}>
      {normalized === 'high' ? 'สูง' : normalized === 'low' ? 'ต่ำ' : 'ปานกลาง'}
    </span>
  );
};

export default PriorityBadge;
