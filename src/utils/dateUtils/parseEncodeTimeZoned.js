 // Hàm decode URL và convert sang Date
export const parseEncodedDate = (encodedDateStr) => {
    const decodedDateStr = decodeURIComponent(encodedDateStr); // Giải mã URL
    return new Date(decodedDateStr);
};

export const parseEncodedDateIso = (encodedDateStr) => {
    const decodedDateStr = decodeURIComponent(encodedDateStr); // Giải mã URL
    return new Date(decodedDateStr);
};
  