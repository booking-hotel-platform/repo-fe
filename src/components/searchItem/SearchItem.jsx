import { useNavigate } from "react-router-dom";
import "./searchItem.css";

const SearchItem = ({ item }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/hotels/${item.id}`)
  }

  return (
    <div className="searchItem">
      <img src={item.photos} alt="" className="siImg" />
      <div className="siDesc">
        <h1 className="siTitle">{item.name}</h1>
        <span className="siDistance">500m from center</span>
        <span className="siTaxiOp">Free airport taxi</span>
        <span className="siSubtitle">
          Studio Apartment with Air conditioning
        </span>
        <span className="siFeatures">{item.description}</span>
        <span className="siCancelOp">Free cancellation </span>
        <span className="siCancelOpSubtitle">
          You can cancel later, so lock in this great price today!
        </span>
      </div>
      <div className="siDetails">
        {item && <div className="siRating">
          <span>Excellent</span>
          <button>{item.rating != null ? item.rating : "New"}</button>
        </div>}
        <div className="siDetailTexts">
          <span className="siPrice">${item.cheapestPrice}</span>
          <span className="siTaxOp">Includes taxes and fees</span>
          <button onClick={handleClick} className="siCheckButton">See rooms availability</button>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
