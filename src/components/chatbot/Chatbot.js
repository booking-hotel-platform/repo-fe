import React, { useState } from "react";

import "./chatbot.css";
import ChatHistory from "../ChatHistory";
import Loading from "../Loading";
import useFetch from "../../hooks/useFetch";

const Chatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: hotels } = useFetch(`${process.env.REACT_APP_API_URL}/hotels?size=25`);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const HotelInfo = ({ hotel }) => (
    <div className="hotel-info">
      <strong>Hotel Name:</strong> {hotel.name}<br />
      <strong>Address:</strong> {hotel.address}<br />
      <strong>City:</strong> {hotel.city}<br />
      <strong>Description:</strong> {hotel.description}<br />
      <strong>Rating:</strong> {hotel.rating}<br />
      <a href={`https://starlit-fudge-cef549.netlify.app//hotels/${hotel.id}`}><img src={hotel.photos} alt={hotel.name} className="hotel-image" /></a>
    </div>
  );


  const sendMessage = async () => {
    if (userInput.trim() === "") return;
    setIsLoading(true);
    try {

      let responseMessage;
      if (userInput.toLowerCase().includes("top 5") || userInput.toLowerCase().includes("top 10")) {
        // Sắp xếp dữ liệu theo rating giảm dần
        const sortedData = hotels.sort((a, b) => {
          const ratingA = a.rating || 0; // Nếu không có rating, coi là 0
          const ratingB = b.rating || 0;
          return ratingB - ratingA; // Sắp xếp giảm dần
        });
        const topN = userInput.toLowerCase().includes("top 10") ? 10 : 5;
        const topHotels = sortedData.slice(0, topN);

        if (topHotels.length > 0) {
          responseMessage = topHotels.map(hotel => (
            <HotelInfo key={hotel.id} hotel={hotel} />
          ));
        } else {
          responseMessage = <div>Không tìm thấy thông tin nào</div>;
        }
      } else {
        const filteredData = hotels.filter(hotel =>
          userInput.toLowerCase().includes(hotel.name.toLowerCase()) ||
          userInput.toLowerCase().includes(hotel.city.toLowerCase()) ||
          userInput.toLowerCase().includes(hotel.description.toLowerCase())
        );
        responseMessage = filteredData.map(hotel => (
          <HotelInfo key={hotel.id} hotel={hotel} />
        ));
      }

      setChatHistory(prevChatHistory => [
        ...prevChatHistory,
        { type: "user", message: userInput },
        { type: "bot", message: <>{responseMessage}</> },
      ]);

    } catch {
      console.error("Lỗi khi gửi tin nhắn");
    } finally {
      setUserInput("");
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  return (
    <div className="chatbot-container">
      <h1 className="chatbot-title">Chatbot</h1>

      <div className="chatbox">
        <ChatHistory chatHistory={chatHistory} />
        <Loading isLoading={isLoading} />
      </div>

      <div className="input-container">
        <input
          type="text"
          className="user-input"
          placeholder="Type your message..."
          value={userInput}
          onChange={handleUserInput}
        />
        <button
          className="send-button"
          onClick={sendMessage}
          disabled={isLoading}
        >
          Send
        </button>
      </div>
      <button
        className="clear-button"
        onClick={clearChat}
      >
        Clear Chat
      </button>
    </div>
  );
};

export default Chatbot;
