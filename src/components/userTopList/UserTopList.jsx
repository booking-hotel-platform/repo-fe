import "./userTopList.css";
import AuthorCard from "../authorCard/AuthorCard";
import useFetch from "../../hooks/useFetch";
import { useEffect, useState } from "react";

const UserTopList = () => {
  const { data } = useFetch(`${process.env.REACT_APP_API_URL}/users`);
  const [top8Users, setTop8Users] = useState([]);

  useEffect(() => {
    if (data) {
      setTop8Users(data.slice(0, 8));
    }
  }, [data]);

  return (
    <div>
      {top8Users.length > 0 && 
        <div className="uTopList">
          <div className="userTopContent">
            <h1 className="userTopTitle">Top 8 author of the month</h1>
            <p className="userTopDetail">Rating based on customer reviews</p>
          </div>
          <div className="pList">
            {top8Users.slice(0, 4).map((user, index) => (
              <AuthorCard key={index} user={user} />
            ))}
          </div>
          <div className="pList">
            {top8Users.slice(4, 8).map((user, index) => (
              <AuthorCard key={index} user={user} />
            ))}
          </div>
        </div>}
    </div>
  );
};

export default UserTopList;
