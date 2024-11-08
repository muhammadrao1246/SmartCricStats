import axios from "axios";
import React, { useRef } from "react";
import { useOutletContext } from "react-router-dom";
import LoadingSpinnerComponent from "src/components/Layouts/LoadingSpinnerComponent";

import TeamPlayersComponent from "src/components/players/TeamPlayersComponent";



function PlayersTab({ team }) {
  let country = team.country

  
  const [progress, setProgress] = useOutletContext();
  const filters = useRef(null)

  // fetching news about player
  React.useEffect(()=>{
    setProgress(60)
    // making a network request to server to fetch stats data
      axios.get(`http://127.0.0.1:8000/api/players/filters/${country.id}`, {
        method: "GET",
        params: {
        },
      })
      .then((response) => {
        setProgress(100)
        filters.current = response.data.data
      })
      .catch((error) => {
        console.log(error);
      });
  }, [country])
  
  return (
    <>
    {filters.current == null ? (
          <LoadingSpinnerComponent />
        ) : (
          <TeamPlayersComponent
            key={country.id}
            country={country}
            filters={filters.current}
          />
        )}
    </>
  );
}

export default PlayersTab;
