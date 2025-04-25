import "./hotel.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import Room from "../../components/room/Room";
import ReviewSection from "../../components/review/Review";
import { useLocation } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useState, useEffect } from 'react';

const Hotel = () => {
  
  const location = useLocation();
  const hotelId  = location.pathname.split('/')[2];
  const { data, loading } = useFetch(`${process.env.REACT_APP_API_URL}/rooms/search?hotelId=${hotelId || ''}`);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/reviews/hotelDetails?hotelId=${hotelId}`);
      const data = await response.json();
      setReviews(data);
    };
    fetchReviews();
  }, [hotelId]);


  return (
    <div>
      {loading ? "Loading..." : 
      <>
        <Navbar />
        <Header />
        {
          data.map((room, i) => (
            <Room key={i} room={room} />
          ))
        }
        <ReviewSection reviews={reviews} setReviews={setReviews} />
        <MailList />
        <Footer />
      </>
      }
    </div>
  );
};

export default Hotel;
