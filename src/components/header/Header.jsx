import {
  faCalendarDays,
  faLocationDot,
  faCity,
  faHotel,
  faClose,
  faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./header.css";
import { DateRange } from "react-date-range";
import { useEffect, useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { newSearch } from "../../redux/features/searchSlice";
import { formatWithTimezone } from "../../utils/dateUtils/formatTimeZoned";

const Header = () => {
  const [activeItem, setActiveItem] = useState("Hotel");
  const [destinationType, setDestinationType] = useState("name");
  const [openDate, setOpenDate] = useState(false);
  const stringPlaceHolder = `Enter ${activeItem} ... `;
  const [destination, setDestination] = useState("");
  const [dates, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + (24 * 60 * 60 * 1000)),
      key: "selection",
    },
  ]);
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (activeItem === 'Hotel') {
      setDestinationType('name');
    } else if (activeItem === 'City') {
      setDestinationType('city');
    }
  }, [activeItem]);

  const handleSearch = async () => {
    const serializedDates = dates.map(date => ({
      startDate: formatWithTimezone(date.startDate).toString(),
      endDate: formatWithTimezone(date.endDate).toString(),
      key: date.key
    }));
    dispatch(newSearch({
      [destinationType]: destination,
      dates: serializedDates,
      minPrice: minPrice,
      maxPrice: maxPrice
    }));
    navigate("/hotels");
  };

  return (
    <div className="header">
      <div className="headerContainer listMode">
        <div className="headerIntroduce">
          <div className="headerContent">
            <h1 className="headerTitle">
              Hotel, car and experiences
            </h1>
            <p className="headerDesc">
              Accompanying us, you won’t just travel — you’ll 
              embark on a journey full of rich experiences, meaningful moments, 
              and unforgettable memories. With Chisfis by your side, 
              every destination becomes more than just a place — it becomes a story waiting to be told.
            </p>
          </div>
          <div className="headerImages">
            <img src='/assets/Header/header01.webp' alt="Logo" />
          </div>
        </div>
        <ul className="headerList">
          <li
            className={`headerListItem ${activeItem === "Hotel" ? "active" : ""}`}
            onClick={() => setActiveItem("Hotel")}
          >
            <FontAwesomeIcon icon={faHotel} />
            <span>Hotel</span>
          </li>

          <li
            className={`headerListItem ${activeItem === "City" ? "active" : ""}`}
            onClick={() => setActiveItem("City")}
          >
            <FontAwesomeIcon icon={faCity} />
            <span>City</span>
          </li>
        </ul>
        <div className="headerSearch">
          <div className="headerSearchItem">
            <FontAwesomeIcon icon={faLocationDot} className="headerIcon" />
            <input
              type="text"
              placeholder={stringPlaceHolder}
              className="headerSearchInput"
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
          <div className="headerSearchItem">
            <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
            <span
              onClick={() => setOpenDate(!openDate)}
              className="headerSearchText"
              tabIndex={0}
            >
              {`${format(dates[0].startDate, "MM/dd/yyyy")} to ${format(
                dates[0].endDate,
                "MM/dd/yyyy"
              )}`}
            </span>
            {openDate && (
              <FontAwesomeIcon 
                onBlur={() => setOpenDate(!openDate)} 
                onClick={() => setOpenDate(!openDate)} 
                icon={faClose} 
                className="headerIcon" 
              />
            )}
            {openDate && (
              <DateRange
                editableDateInputs={true}
                onChange={(item) => setDate([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={dates}
                className="date"
                minDate={new Date()}
              />
            )}
          </div>
          <div className="headerSearchItem">
            <FontAwesomeIcon icon={faMoneyBill} className="headerIcon" />
            <select
              className="priceSelect"
              onChange={(e) => setMinPrice(e.target.value)}
              value={minPrice || ''}
            >
              <option value="">{minPrice || 'Min Price'}</option>
              <option value="100">100 $</option>
              <option value="200">200 $</option>
              <option value="300">300 $</option>
              <option value="500">500 $</option>
            </select>
          </div>
          <div className="headerSearchItem">
            <FontAwesomeIcon icon={faMoneyBill} className="headerIcon" />
            <select
              className="priceSelect"
              onChange={(e) => setMaxPrice(e.target.value)}
              value={maxPrice || ''}
            >
              <option value="">{maxPrice || 'Max Price'}</option>
              <option value="100">100 $</option>
              <option value="200">200 $</option>
              <option value="300">300 $</option>
              <option value="500">500 $</option>
            </select>
          </div>

          <div className="headerSearchItem">
            <button className="headerBtn" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
