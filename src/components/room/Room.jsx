import { faCircleArrowLeft, faCircleArrowRight, faCircleXmark, faLocationDot, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useEffect, useState } from 'react'
import useFetch from '../../hooks/useFetch';
import { useSelector } from 'react-redux';
import { parseEncodedDate } from '../../utils/dateUtils/parseEncodeTimeZoned';
import { convertToISOStringWithTimezone, decodeURIComponent } from '../../utils/dateUtils/formatTimeZoned';
import { message } from 'antd';
import axios from 'axios';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const Room = ({ room }) => {
  const [slideNumber, setSlideNumber] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [days, setDays] = useState(null);
  const { data: dataImg, loading } = useFetch(`${process.env.REACT_APP_API_URL}/images/imageByRoom?roomId=${room?.roomId || 5}`)

  const errorSearch = useCallback((message) => {
    messageApi.open({
      type: 'error',
      content: message,
    });
  }, [messageApi]);

  useEffect(() => {
    if (error) {
      errorSearch(error);
    }
  }, [error, errorSearch]);

  const handleOpen = (i) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleChangeDate = (item) => {
    const newCheckIn = item.selection.startDate;
    const newCheckOut = item.selection.endDate;

    // Kiểm tra nếu các ngày hợp lệ
    if (newCheckIn && newCheckOut) {
      setCheckIn(newCheckIn);
      setCheckOut(newCheckOut);
    }
  }

  const { dates } = useSelector(state => state.search);

  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

  const dayDifference = (date1, date2) => {
    if (!date1 || !date2) return 0; // Trả về 0 nếu một trong hai ngày là null hoặc không hợp lệ

    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }

  useEffect(() => {
    if (dates[0]?.startDate && dates[0]?.endDate) {
      const parsedStartDate = parseEncodedDate(dates[0]?.startDate);
      const parsedEndDate = parseEncodedDate(dates[0]?.endDate);

      // Kiểm tra nếu parsedStartDate và parsedEndDate hợp lệ
      if (parsedStartDate && parsedEndDate) {
        setStartDate(parsedStartDate);
        setEndDate(parsedEndDate);
        setDays(dayDifference(parsedEndDate, parsedStartDate));
      }
    }
  }, [dates]);

  useEffect(() => {
    if (checkIn && checkOut) {
      setStartDate(checkIn);
      setEndDate(checkOut);
      setDays(dayDifference(checkOut, checkIn));
    }
  }, [checkIn, checkOut]);

  const handleCreateBooking = async () => {
    try {
      // Kiểm tra xem dates[0]?.startDate và dates[0]?.endDate có hợp lệ hay không
      const checkInDate = dates[0]?.startDate ? decodeURIComponent(dates[0]?.startDate) : convertToISOStringWithTimezone(checkIn);
      const checkOutDate = dates[0]?.endDate ? decodeURIComponent(dates[0]?.endDate) : convertToISOStringWithTimezone(checkOut);

      const resBooking = await axios.post(
        `${process.env.REACT_APP_API_URL}/bookings?roomId=${room?.roomId}`,
        {
          checkInDate: checkInDate,
          checkOutDate: checkOutDate,
          totalPrice: (days || 1) * (room?.price)
        },
        {
          withCredentials: true // Thêm dòng này để gửi cookie
        }
      );

      const newBooking = resBooking?.data;
      const resPayment = await axios.post(
        `${process.env.REACT_APP_API_URL}/payments/checkout?bookingId=${newBooking?.bookingId}`,
        {},
        {
          withCredentials: true // Thêm dòng này để gửi cookie
        }
      );

      const paymentUrl = resPayment?.data?.sessionUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      }
      setError('');
    } catch (error) {
      setError(error.response?.data?.errors?.[0] || 'Please select check-in and check-out date');
    }
  };

  const handleMove = (direction) => {
    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? 5 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === 5 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber)
  };

  return (
    <div>
      {contextHolder}
      {loading ? "Loading..." : <div className="hotelContainer">
        {open && (
          <div className="slider">
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="close"
              onClick={() => setOpen(false)}
            />
            <FontAwesomeIcon
              icon={faCircleArrowLeft}
              className="arrow"
              onClick={() => handleMove("l")}
            />
            <div className="sliderWrapper">
              <img src={dataImg[slideNumber]?.imageUrl} alt="" className="sliderImg" />
            </div>
            <FontAwesomeIcon
              icon={faCircleArrowRight}
              className="arrow"
              onClick={() => handleMove("r")}
            />
          </div>
        )}
        <div className="hotelWrapper">
          <h1 className="hotelTitle">{room?.roomType || 'Luxury room'}</h1>
          <div className="hotelAddress">
            <FontAwesomeIcon icon={faLocationDot} />
            <span>{room?.hotelResponse?.address}</span>
          </div>
          <span className="hotelDistance">
            Excellent location – {room?.hotelResponse?.city}
          </span>
          <span className="hotelPriceHighlight">
            Book a stay over ${room?.price} at this property and get a free airport taxi
          </span>
          <div className="hotelImages">
            {dataImg.map((photo, i) => (
              <div className="hotelImgWrapper" key={i}>
                <img
                  onClick={() => handleOpen(i)}
                  src={photo.imageUrl}
                  alt=""
                  className="hotelImg"
                />
              </div>
            ))}
          </div>
          <div className="hotelDetails">
            <div className="hotelDetailsTexts">
              <h1 className="hotelTitle">Stay in the heart of City</h1>
              <p className="hotelDesc">
                Located a 5-minute walk from St. Florian's Gate in Krakow, Tower
                Street Apartments has accommodations with air conditioning and
                free WiFi. The units come with hardwood floors and feature a
                fully equipped kitchenette with a microwave, a flat-screen TV,
                and a private bathroom with shower and a hairdryer. A fridge is
                also offered, as well as an electric tea pot and a coffee
                machine. Popular points of interest near the apartment include
                Cloth Hall, Main Market Square and Town Hall Tower. The nearest
                airport is John Paul II International Kraków–Balice, 16.1 km
                from Tower Street Apartments, and the property offers a paid
                airport shuttle service.
              </p>
            </div>
            <div className="hotelDetailsPrice">
              <div className="priceHeader">
                <h2 className="pricePerNight">${room?.price} /night</h2>
                <div className="reviewRating">
                  <span className="ratingValue">{room?.hotelResponse?.rating || 5.0} <FontAwesomeIcon icon={faStar} /></span>
                  <span className="ratingText">(122 reviews)</span>
                </div>
              </div>

              <div className="dateSection">
                {dates[0]?.startDate && dates[0]?.endDate ? (
                  <>
                    <div className="dateRow">
                      <span>Check in</span>
                      <span className="dateValue">
                        {parseEncodedDate(dates[0]?.startDate)?.toDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="dateRow">
                      <span>Check out</span>
                      <span className="dateValue">
                        {parseEncodedDate(dates[0]?.endDate)?.toDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="datePickerFallback">
                    <span>Vui lòng chọn lại ngày check-in và check-out:</span>
                    <DateRange
                      editableDateInputs={true}
                      onChange={handleChangeDate}
                      moveRangeOnFirstSelection={false}
                      ranges={[{ startDate: checkIn || new Date(), endDate: checkOut || new Date(), key: 'selection' }]}
                    />
                  </div>
                )}
              </div>

              <div className="priceBreakdown">
                <div className="priceRow">
                  <span>${room?.price * (days || 1)} / {days || 1} night</span>
                  <span>${(days || 1) * (room?.price)}</span>
                </div>
              </div>

              <div className="totalPrice">
                <span>Total</span>
                <span className="totalAmount">${(days || 1) * (room?.price)}</span>
              </div>

              <button className="reserveButton" onClick={handleCreateBooking}>
                Reserve
              </button>
            </div>
          </div>
        </div>
      </div>}
    </div>
  );
}

export default Room;
