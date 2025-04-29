import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import Featured from "../../components/featured/Featured";
import FeaturedProperties from "../../components/featuredProperties/FeaturedProperties";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Navbar from "../../components/navbar/Navbar";
import PropertyList from "../../components/propertyList/PropertyList";
import UserTopList from "../../components/userTopList/UserTopList";
import Chatbot from "../../components/chatbot/Chatbot"; // Import Chatbot
import "./home.css";

const Home = () => {
  const [showChatbot, setShowChatbot] = useState(false); // State to control chatbot visibility

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  return (
    <div>
      <Navbar />
      <Header />
      <div className="homeContainer">
        <div className="homeContent">
          <h1 className="homeTitle">Suggestions for discovery</h1>
          <p className="homeTitleDetail">Popular places to recommends for you</p>
        </div>
        <Featured />
        <div className="homeContent">
          <h1 className="homeTitle">Featured places to stay</h1>
          <p className="homeTitleDetail">Popular places to stay that Chisfis recommends for you</p>
        </div>
        <FeaturedProperties />
        <div className="homeContent">
          <h1 className="homeTitle">Suggestions for discovery</h1>
          <p className="homeTitleDetail">Popular places to stay that Chisfis recommends for you</p>
        </div>
        <PropertyList />
        <MailList />
        <UserTopList />
        <Footer />
      </div>
      
      {/* Chatbot Button with Icon */}
      <button
        className="chatbot-button"
        onClick={toggleChatbot}
      >
        <FontAwesomeIcon icon={faComments} size="lg" />
      </button>

      {/* Chatbot Component */}
      {showChatbot && (
        <div className="chatbot-popup">
          <Chatbot />
        </div>
      )}
    </div>
  );
};

export default Home;
