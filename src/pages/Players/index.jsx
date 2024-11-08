import axios from "axios";
import React, { useRef } from "react";
import { Link, useLocation, useLoaderData, useOutletContext } from "react-router-dom";

import "src/assets/css/players.css"
import LoadingSpinnerComponent from "src/components/Layouts/LoadingSpinnerComponent";
import TeamPlayersComponent from "src/components/players/TeamPlayersComponent";
import { FindTeamLongName } from "src/utils/utils";


function Players() {
  const [progress, setProgress] = useOutletContext();

  const data = useLoaderData().data;

  const [country, setCountry] = React.useState(data[0]);
  const filters = useRef(null)
  
  React.useEffect(()=>{
    $(".select2").select2()
    $("#countrySelect").on('select2:select', function (e) {
        setCountry(data[e.target.value])
      });
  }, [])

  // fetching news about player
  React.useEffect(()=>{
    // making a network request to server to fetch stats data
      axios.get(`http://127.0.0.1:8000/api/players/filters/${country.id}`, {
        method: "GET",
        params: {
        },
      })
      .then((response) => {
        setProgress(60)
        filters.current = response.data.data
      })
      .catch((error) => {
        console.log(error);
      });
  }, [country])

  // here the page content is defined
  return (
    <>
      {/* Page Content  */}
      <div className="col-lg-12">
        <div className="row">
          <div className="col-lg-4">
            <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
              <div className="iq-card-body pt-2 pb-2">
                <div className="d-flex justify-content-start align-items-center w-100">
                  <span className="player-title ml-3">
                    Players{" "}
                    <small className="text-muted ml-2">(under countries)</small>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
              <div className="iq-card-body pt-2 pb-2 h-100 d-flex align-items-center">
                <div className="row no-gutters w-100">
                  <div className="col-lg-6">
                    <span className="player-team-heading">Select Country</span>
                  </div>
                  <div className="col-lg-6">
                    <select
                      id="countrySelect"
                      className={`form-select form-control form-control-sm select2`}
                    >
                      {data.map((countryObject, index) => (
                        <option key={countryObject.id} value={index}>
                          {countryObject.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-8">
        {filters.current == null ? (
          <LoadingSpinnerComponent />
        ) : (
          <TeamPlayersComponent
            key={country.id}
            country={country}
            filters={filters.current}
          />
        )}
      </div>
    </>
  );
}


export default Players;
