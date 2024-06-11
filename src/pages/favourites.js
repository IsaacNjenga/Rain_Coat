// Favourites.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

function Favourites() {
  const [favourites, setFavourites] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      axios
        .get(`favourites/${currentUser.uid}`)
        .then((result) => {
          const sortedFavourites = result.data.sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
          setFavourites(sortedFavourites);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [currentUser]);

  return (
    <div>
      {favourites.length ? (
        favourites.map((favourite, index) => (
          <div key={index}>
            <ul>
              <li style={{ color: "white" }}>{favourite.name}</li>
            </ul>
          </div>
        ))
      ) : (
        <div>
          <p>Empty</p>
        </div>
      )}
    </div>
  );
}

export default Favourites;
