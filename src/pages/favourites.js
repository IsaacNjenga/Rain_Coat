import React from "react";
import { useLocation } from "react-router-dom";

function Favourites() {
  const location = useLocation();
  const favourites = location.state?.favourites;
  return (
    <div>
      {favourites ?
        favourites.map((city, index) => {
          return (
            <div>
              <ul key={index}>
                <li>{city}</li>
              </ul>
            </div>
          );
        }):(<div><p>Empty</p></div>)}
    </div>
  );
}

export default Favourites;
