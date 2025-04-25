// Featured.js
import "./featured.css";
import useFetch from "../../hooks/useFetch";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { newSearch } from "../../redux/features/searchSlice";

const Featured = () => {
  const navigate = useNavigate();
  const [countByCityMap, setCountByCityMap] = useState({ 'Da Nang': 0 });
  const { data, loading } = useFetch(`${process.env.REACT_APP_API_URL}/hotels/countByCity`);
  const dispatch = useDispatch();

  const images = [
    "https://cf.bstatic.com/xdata/images/city/max500/957801.webp?k=a969e39bcd40cdcc21786ba92826063e3cb09bf307bcfeac2aa392b838e9b7a5&o=",
    "https://cf.bstatic.com/xdata/images/city/max500/690334.webp?k=b99df435f06a15a1568ddd5f55d239507c0156985577681ab91274f917af6dbb&o=",
    "https://cf.bstatic.com/xdata/images/city/max500/689422.webp?k=2595c93e7e067b9ba95f90713f80ba6e5fa88a66e6e55600bd27a5128808fdf2&o="
  ]

  useEffect(() => {
    data?.countByCityMap && setCountByCityMap(prev => ({ ...prev, ...data.countByCityMap }));
  }, [data])

  const handleClick = (city) => {
    dispatch(newSearch({ city: city, dates: [] }));
    navigate("/hotels");
  }

  return (
    <div className="featured">
      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <>
          {Object.entries(countByCityMap).map(([city, count], index) => (
            <div 
              className="featuredItem" 
              key={index}
              onClick={() => handleClick(city)}
              role="button"
              tabIndex={0}
            >
              <img
                src={images[index]}
                alt={city}
                className="featuredImg"
              />
              <div className="featuredTitles">
                <h1>{city}</h1>
                <h2>{count} properties</h2>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Featured;
