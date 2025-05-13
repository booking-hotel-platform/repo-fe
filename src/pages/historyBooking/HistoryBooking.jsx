import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Clock, Filter, ListOrdered, Search } from 'lucide-react';
import { Button, Empty, Select, Pagination, Skeleton, Tag } from 'antd';
import useFetch from '../../hooks/useFetch';
import './historyBooking.css';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import axios from 'axios';

const BookingHistory = () => {
    const navigate = useNavigate();
    // Thêm state phân trang
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0
    });
    const [filters, setFilters] = useState({
        status: 'ALL',
        sort: 'NEWEST',
        search: ''
    });
    const [processedData, setProcessedData] = useState([]);
    const { data: dataBookingHistory, loading, error } = useFetch(`${process.env.REACT_APP_API_URL}/bookings/booking-by-user`);

    // Thêm logic reset trang khi filter thay đổi
    useEffect(() => {
        setPagination(prev => ({ ...prev, current: 1 }));
    }, [filters.status, filters.sort, filters.search]);

    useEffect(() => {
        const processBookings = () => {
            if (!dataBookingHistory) return [];

            // Filter logic
            const filtered = dataBookingHistory.filter(booking => {
                const searchMatch = `${booking.bookingId} ${booking?.roomResponse?.roomType || ''}`
                    .toLowerCase()
                    .includes(filters.search.toLowerCase().trim());

                const statusMatch = filters.status === 'ALL'
                    || booking.status === filters.status;

                return searchMatch && statusMatch;
            });

            // Sort logic
            const sorted = [...filtered].sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);

                switch (filters.sort) {
                    case 'NEWEST': return dateB - dateA;
                    case 'OLDEST': return dateA - dateB;
                    case 'PRICE_ASC': return (a.totalPrice || 0) - (b.totalPrice || 0);
                    case 'PRICE_DESC': return (b.totalPrice || 0) - (a.totalPrice || 0);
                    default: return 0;
                }
            });

            // Tính toán phân trang
            const startIndex = (pagination.current - 1) * pagination.pageSize;
            const paginatedData = sorted.slice(startIndex, startIndex + pagination.pageSize);

            // Cập nhật state
            setPagination(prev => ({ ...prev, total: sorted.length }));
            return paginatedData;
        };

        setProcessedData(processBookings());
    }, [dataBookingHistory, filters, pagination]);

    const handlePaymentAgain = async (bookingId) => {
        const resPayment = await axios.post(`${process.env.REACT_APP_API_URL}/payments/checkout?bookingId=${bookingId}`);
        const paymentUrl = resPayment?.data?.sessionUrl;
        if (paymentUrl) {
            window.location.href = paymentUrl;
        }
    }

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <>
            <Navbar />
            <div className="booking-history-container">
                <div className="booking-history-header">
                    <h1 className="page-title">
                        <CalendarDays size={28} className="icon-spacing" />
                        BOOKING HISTORY
                    </h1>

                    <div className="control-bar">
                        <div className="search-filter-group">
                            <div className="search-input">
                                <Search size={18} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Find by booking ID and room name..."
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                />
                            </div>

                            <Select
                                suffixIcon={<Filter size={16} />}
                                className="status-filter"
                                onChange={(value) => handleFilterChange('status', value)}
                                options={[
                                    { value: 'ALL', label: 'All status' },
                                    { value: 'COMPLETED', label: 'PAID' },
                                    { value: 'PENDING', label: 'PENING' },
                                    { value: 'CANCELLED', label: 'CANCELED' }
                                ]}
                            />

                            <Select
                                suffixIcon={<ListOrdered size={16} />}
                                className="sort-select"
                                onChange={(value) => handleFilterChange('sort', value)}
                                options={[
                                    { value: 'NEWEST', label: 'NEWEST' },
                                    { value: 'OLDEST', label: 'OLDEST' },
                                    { value: 'PRICE_ASC', label: 'PRICE_ASC' },
                                    { value: 'PRICE_DESC', label: 'PRICE_DESC' }
                                ]}
                            />
                        </div>
                    </div>
                </div>

                <div className="booking-list">
                    {loading ? (
                        Array(3).fill().map((_, i) => (
                            <Skeleton key={i} active paragraph={{ rows: 3 }} className="booking-skeleton" />
                        ))
                    ) : error ? (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <span className="error-text">
                                    Error Reload.
                                    <Button type="link" onClick={() => window.location.reload()}>Thử lại</Button>
                                </span>
                            }
                        />
                    ) : processedData?.length === 0 ? (
                        <Empty
                            description="Không tìm thấy đơn đặt nào phù hợp"
                            imageStyle={{ height: 80 }}
                        >
                            <Button type="primary" onClick={() => navigate('/')}>
                                Booking Right Now
                            </Button>
                        </Empty>
                    ) : (
                        processedData?.map(booking => (
                            <div key={booking.bookingId} className={`booking-card status-${booking.status.toLowerCase()}`}>
                                <div className="booking-header">
                                    <div className="booking-meta">
                                        <span className="booking-id">#{booking.bookingId}</span>
                                        <Tag
                                            color={
                                                booking.status === 'COMPLETED' ? 'green' :
                                                    booking.status === 'PENDING' ? 'orange' : 'red'
                                            }
                                            className="status-tag"
                                        >
                                            {booking.status === 'COMPLETED' ? 'THÀNH CÔNG' :
                                                booking.status === 'PENDING' ? 'PENDING' : 'CANCELED'}
                                        </Tag>
                                    </div>
                                    <span className="booking-date">
                                        <Clock size={14} />
                                        {new Date(booking.createdAt).toLocaleDateString('vi-VN', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>

                                <div className="booking-body">
                                    <div className="room-info">
                                        <img
                                            src={booking.roomImage || 'https://res.cloudinary.com/ds6fxaiqd/image/upload/v1742960954/fcszlyjfv8cxzcfsgx86.png'}
                                            className="room-thumbnail"
                                            alt={booking?.roomResponse?.roomType}
                                        />
                                        <div>
                                            <h3 className="room-name">{booking?.roomResponse?.roomType || 'Room Type Unknown'}</h3>
                                            <div className="booking-dates">
                                                <span>
                                                    {new Date(booking?.checkInDate).toDateString() || Date.now()} →
                                                    {new Date(booking?.checkOutDate).toDateString() || Date.now()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="price-section">
                                        <span className="price-label">Total Price</span>
                                        <span className="price-value">
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'USD'
                                            }).format(booking.totalPrice || 0)}
                                        </span>
                                    </div>
                                </div>

                                <div className="booking-actions">
                                    <Button
                                        type="link"
                                        onClick={() => navigate(`/bookings/${booking.bookingId}`)}
                                    >
                                        See Details
                                    </Button>
                                    {booking.status === 'PENDING' && (
                                        <Button
                                            danger
                                            onClick={() => handlePaymentAgain(booking.bookingId)}
                                        >
                                            Pay Again
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
                     {/* Thêm component Pagination vào JSX */}
                {!loading && !error && processedData?.length > 0 && (
                    <div className="pagination-wrapper">
                        <Pagination
                            current={pagination.current}
                            pageSize={pagination.pageSize}
                            total={pagination.total}
                            onChange={(page) => setPagination(prev => ({ ...prev, current: page }))}
                            showSizeChanger={false}
                            className="custom-pagination"
                        />
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default BookingHistory;