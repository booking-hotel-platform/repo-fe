import React from 'react';
import './amenities.css';

const amenities = [
  { icon: "🏠", label: "Căn hộ" },
  { icon: "☕", label: "Bữa sáng" },
  { icon: "🍽️", label: "2 nhà hàng" },
  { icon: "🐾", label: "Cho phép mang theo vật nuôi" },
  { icon: "🚌", label: "Xe đưa đón sân bay" },
  { icon: "💆‍♀️", label: "Trung tâm Spa & chăm sóc sức khoẻ" },
  { icon: "👨‍👩‍👧‍👦", label: "Phòng gia đình" },
  { icon: "🚭", label: "Phòng không hút thuốc" },
  { icon: "🛎️", label: "Dịch vụ phòng" },
  { icon: "🍖", label: "Tiện nghi BBQ" },
];

const Amenities = () => {
    return (
      <div className="grid">
        {amenities.map((item, index) => (
          <div key={index}>
            <div className="text-3xl mb-2">{item.icon}</div>
            <div className="text-center text-sm font-medium">{item.label}</div>
          </div>
        ))}
      </div>
    );
  };

export default Amenities;
