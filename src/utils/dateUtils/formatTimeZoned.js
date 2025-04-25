export const formatWithTimezone = (date) => {
    // Tạo offset +07:00
    const timezoneOffset = 7; // GMT+7
    const adjustedDate = new Date(date.getTime() + timezoneOffset * 60 * 60 * 1000);
    
    // Format thành chuỗi và encode dấu +
    return encodeURIComponent(
      adjustedDate.toISOString()
        .replace('Z', '') // Bỏ Z cuối chuỗi
        .replace(/\.\d+/, '') // Bỏ milliseconds
        + `+07:00` // Thêm timezone
    );
};

export const decodeURIComponent = (encodedURIComponent) => {  
    return encodedURIComponent.replace(/%2B/g, '+').replace(/%3A/g, ':');
};

export const convertToISOStringWithTimezone = (date) => {
    // Lấy múi giờ hiện tại của đối tượng Date
    const timezoneOffset = date.getTimezoneOffset() / 60; // Get offset in hours
    
    // Convert thành chuỗi ISO, bỏ milliseconds và thêm múi giờ
    const isoString = date.toISOString()
      .replace('Z', '') // Bỏ Z cuối chuỗi
      .replace(/\.\d+/, '') // Bỏ milliseconds
      + (timezoneOffset > 0 ? `-${Math.abs(timezoneOffset).toString().padStart(2, '0')}:00` 
                            : `+${Math.abs(timezoneOffset).toString().padStart(2, '0')}:00`);
    
    return isoString;
};

  