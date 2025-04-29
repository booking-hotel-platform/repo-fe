import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios"; // Thêm thư viện axios

// Style components using Tailwind CSS
import "./App.css";
import ChatHistory from "./component/ChatHistory";
import Loading from "./component/Loading";

const App = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [websiteData, setWebsiteData] = useState(null); // Thêm state để lưu dữ liệu từ website

  const genAI = new GoogleGenerativeAI("AIzaSyAqWT6nWJM3E450B5Aqb-qbg16A_wLWN0o");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Hàm để lấy dữ liệu từ website
  const fetchWebsiteData = async () => {
    try {
      const response = await axios.get("https://starlit-fudge-cef549.netlify.app/"); // Lấy dữ liệu từ website
      setWebsiteData(response.data); // Lưu dữ liệu vào state
    } catch (error) {
      console.error("Error fetching website data:", error);
    }
  };

  useEffect(() => {
    fetchWebsiteData(); // Gọi hàm khi component được mount
  }, []);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const sendMessage = async () => {
    if (userInput.trim() === "") return;

    setIsLoading(true);
    try {
      // Sử dụng dữ liệu từ website để tạo phản hồi
      const result = await model.generateContent(`${userInput} Dữ liệu từ website: ${websiteData}`);
      const response = await result.response;
      console.log(response);
      setChatHistory([
        ...chatHistory,
        { type: "user", message: userInput },
        { type: "bot", message: response.text() },
      ]);
    } catch {
      console.error("Error sending message");
    } finally {
      setUserInput("");
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-4">Chatbot</h1>
      <div className="chat-container rounded-lg shadow-md p-4">
        <ChatHistory chatHistory={chatHistory} />
        <Loading isLoading={isLoading} />
      </div>
      <div className="flex mt-4">
        <input
          type="text"
          className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={userInput}
          onChange={handleUserInput}
        />
        <button
          className="px-4 py-2 ml-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
          onClick={sendMessage}
          disabled={isLoading}
        >
          Send
        </button>
      </div>
      <button
        className="mt-4 block px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 focus:outline-none"
        onClick={clearChat}
      >
        Clear Chat
      </button>
    </div>
  );
};

export default App;
