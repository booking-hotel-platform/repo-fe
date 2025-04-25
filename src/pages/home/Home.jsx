import Featured from "../../components/featured/Featured";
import FeaturedProperties from "../../components/featuredProperties/FeaturedProperties";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Navbar from "../../components/navbar/Navbar";
import PropertyList from "../../components/propertyList/PropertyList";
import UserTopList from "../../components/userTopList/UserTopList";
import "./home.css";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Header/>
      <div className="homeContainer">
        <div className="homeContent">
          <h1 className="homeTitle">Suggestions for discovery</h1>
          <p className="homeTitleDetail">Popular places to recommends for you</p>
        </div>
        <Featured/>
        <div className="homeContent">
          <h1 className="homeTitle">Featured places to stay</h1>
          <p className="homeTitleDetail">Popular places to stay that Chisfis recommends for you</p>
        </div>
        <FeaturedProperties/>
        <div className="homeContent">
          <h1 className="homeTitle">Suggestions for discovery</h1>
          <p className="homeTitleDetail">Popular places to stay that Chisfis recommends for you</p>
        </div>
        <PropertyList/>
        <MailList/>
        <UserTopList/>
        <Footer/>
      </div>
    </div>
  );
};

export default Home;
