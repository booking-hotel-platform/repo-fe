import useFetch from "../../hooks/useFetch";
import "./propertyList.css";
import { useEffect, useState } from "react";
import Loading from "../Loading";
const PropertyList = () => {
  const [top5Hotels, setTop5Hotels] = useState([])
  const { data, loading } = useFetch(`${process.env.REACT_APP_API_URL}/hotels?size=25`)
  useEffect(() => {
    const topRatedHotels = data
      .filter(hotel => hotel.rating !== null) // Lọc những khách sạn có rating
      .sort((a, b) => b.rating - a.rating) // Sắp xếp theo rating giảm dần
      .slice(0, 5); // Lấy 5 khách sạn đầu tiên
    setTop5Hotels(topRatedHotels);
  }, [data])

  return (
    <div className="pList">
      {loading ? <Loading isLoading={loading}/>
        :
        <>
          {top5Hotels?.map((hotel) => {
            return (
              <div className="pListItem" key={hotel?.id}>
                <img
                  src={hotel?.photos}
                  alt=""
                  className="pListImg"
                />
                <div className="pListTitles">
                  <h1>{hotel?.name}</h1>
                  <h2>{hotel?.address}</h2>
                </div>
              </div>
            )
          })}
        </>}
    </div>
  );
};

export default PropertyList;
