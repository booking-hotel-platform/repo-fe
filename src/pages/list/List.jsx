import "./list.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import { useEffect, useState, useCallback } from "react";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";
import { useSelector } from "react-redux";
import { message } from 'antd';
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import '../../components/map/fixLeafletIcon';
import Loading from "../../components/Loading";
const List = () => {
  const [mapCenter, setMapCenter] = useState([16.0583, 108.2772]); 

  const [messageApi, contextHolder] = message.useMessage();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);

  const { city, dates, minPrice, maxPrice, name } = useSelector(state => state.search);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const { data, loading, error } = useFetch(
    `${process.env.REACT_APP_API_URL}/hotels/search?name=${name || ''}&city=${city || ''}&checkInDate=${dates[0]?.startDate || ''}&checkOutDate=${dates[0]?.endDate || ''}&minPrice=${minPrice || 0}&maxPrice=${maxPrice || 9999999}`
  );

  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem) || [];
  const totalPages = Math.ceil((data?.length || 0) / itemsPerPage);

  const errorSearch = useCallback((message) => {
    messageApi.open({
      type: 'error',
      content: message,
    });
  }, [messageApi]);

  useEffect(() => {
    if (error) {
      errorSearch(error.response?.data?.errors?.[0] || 'Error fetching data');
    }
  }, [error, errorSearch, data]);

  useEffect(() => {
    const fetchMapCenter = async () => {
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?city=${city}&format=json`);
        const { lat, lon } = response.data[0];
        setMapCenter([lat, lon]);
      } catch (error) {
        console.error('Error fetching map center:', error);
      }
    };

    if (city) {
      fetchMapCenter();
    }
  }, [city]);

  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listResult">
            {loading ? (
              <><Loading isLoading={loading}/></>
            ) : (
              <>
                {currentItems.map((item, index) => (
                  <SearchItem item={item} key={item.id || index} />
                ))}

                {data?.length > 0 && (
                  <div className="pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Before
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={currentPage === i + 1 ? "active" : ""}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      After
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mapSection">
      <h1 className="mapTitle">Map</h1>
      <div className={`mapContainerWrapper expanded`}>
        <MapContainer
          center={mapCenter}
          zoom={12}
          className="bright-map"
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={mapCenter}>
            <Popup>Vị trí hiện tại</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
    
      <MailList />
      <Footer />
    </div>
  );
};

export default List;
