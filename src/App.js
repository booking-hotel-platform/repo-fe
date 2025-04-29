import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import ResetPassword from "./pages/resetPassword/ResetPassword";
import PaymentSuccess from "./pages/paymentSuccess/PaymentSuccess";
import PaymentCancel from "./pages/paymentCancel/PaymentCancel";
import BookingHistory from "./pages/historyBooking/HistoryBooking";
import Chatbot from "./components/chatbot/Chatbot";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<List />} />
        <Route path="/hotels/:id" element={<Hotel />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/checkout/success" element={<PaymentSuccess />} />
        <Route path="/checkout/cancel" element={<PaymentCancel />} />
        <Route path="/booking-history" element={<BookingHistory />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </Router>
  );
}

export default App;
