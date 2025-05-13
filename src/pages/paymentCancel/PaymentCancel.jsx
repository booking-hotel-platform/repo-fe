import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, Home, Ticket } from 'lucide-react';
import { Button, Skeleton } from 'antd';
import useFetch from '../../hooks/useFetch';
import './paymentCancel.css';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const navigate = useNavigate();
  const { data, loading, error } = useFetch(`${process.env.REACT_APP_API_URL}/bookings/${bookingId}`);

  if (!bookingId) {
    return (
      <div className="payment-success-container">
        <div className="payment-success-box">
          <h2 className="payment-title">Lỗi: Thiếu ID đơn hàng</h2>
          <Button className="return-home-btn" onClick={() => navigate('/')}>
            <Home />
            Back Home Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar/>
      <div className="payment-success-container">
        <div className="payment-success-box">
          <div className="cancel-icon">
            <XCircle size={50} />
          </div>
          <h1 className="payment-title">CANCELED PAYMENT!</h1>
          <p className="payment-message">Thank you for using our service!</p>
  
          {loading ? (
            <div className="skeleton-loading">
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <Button className="retry-btn" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <div className="order-info">
                <h2>Booking Information</h2>
                <div className="order-details">
                  <div>
                    <p>
                      <span>Booking ID : </span> {data?.bookingId}
                    </p>
                    <p>
                      <span>Booking Created Date : </span> 
                      {new Date(data?.createdAt).toDateString()}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span>Total Price : </span> 
                      ${data?.totalPrice?.toString()}
                    </p>
                    <p>
                      <span>Status :</span> 
                      <span className="paid-status">{data?.status === 'COMPLETED' ? 'Paid' : 'Pending'}</span>
                    </p>
                  </div>
                </div>
              </div>
  
              <div className="button-group">
                <Button className="view-booking-btn" onClick={() => navigate('/booking-history')}>
                  <Ticket />
                  View Your Bookings
                </Button>
                <Button className="return-home-btn" onClick={() => navigate('/')}>
                  <Home />
                  Back Home Page
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default PaymentCancel;
