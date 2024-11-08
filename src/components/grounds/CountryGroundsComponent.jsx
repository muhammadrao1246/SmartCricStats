import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation, useOutletContext } from "react-router-dom";
import _ from "lodash";

import { FindGroundImage, FindGroundLongName, FindGroundProfile, FindPlayerFaceImage, FindPlayerName, FindPlayerProfile, FindTeamImage } from "src/utils/utils";
import LoadingSpinnerComponent from "../Layouts/LoadingSpinnerComponent";


import "./components.css";

import GroundListCard from "./GroundListCard";
import ReactPaginate from "react-paginate";

function CountryGroundsComponent({ country, towns }) {
  const [progress, setProgress] = useOutletContext();

  const ROOT_URL = `http://127.0.0.1:8000/api/grounds/countries/${country.id}`;

  const [town, setTown] = useState(null)
  console.log(towns)

  const [isLoading, setLoading] = useState(true)
  
  // declaring data states
  const [grounds, setGrounds] = React.useState([]);
  // will hold the current page
  const [page, setPage] = React.useState(0)


  // will hold the total number of pages
  let total_count = useRef(0);
  let SIZE = useRef(20)

  function resetPagination() {
    total_count.current = 0;
  }

  const fetchGrounds = ()=>{
    setLoading(true)
    // setting progress bar to 60 percentage
    setProgress(60)
    // making a network request to server to fetch stats data
      axios.get(ROOT_URL, {
        method: "GET",
        params: {
          page_size: SIZE.current,
          page: page + 1,
          town,
          ordering: "longName",
        },
      })
      .then((response) => {
        total_count.current = response.data.data.count;
        setProgress(100)
        // current_page.current++;
        setGrounds(response.data.data.results);
        
        if (window.scrollY > (document.body.scrollHeight - 1000) ) {
          window.scrollTo(0,0)
        }
        
        
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(()=>{
        setLoading(false)
      });
      
  }

  React.useEffect(()=>{
    $(".select2").select2()
    $("#townSelect").on('select2:select', function (e) {
        resetPagination();setPage(0);
        setTown(e.target.value)
      });
  }, [town])

  // fetching news about player
  React.useEffect(()=>{
    fetchGrounds()
  }, [country, town, page])

  let groundColClass = "col-lg-6", groundCardClass = "p-3";

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
            <div className="iq-card-body">
              <div className="row">
                <div className="col-lg-6">
                  <div className="d-flex justify-content-start align-items-center w-100">
                    <img
                      src={FindTeamImage(country)}
                      alt=""
                      className="avatar-60"
                    />
                    <span className="player-team-title ml-3">
                      Grounds in {country.name} 
                    </span>
                  </div>
                </div>
                <div className="col-lg-6" key={town}>
                  <div  className="d-flex h-100 justify-content-end align-items-center">
                    <div className="w-50">
                    <select
                        id="townSelect"
                        className={`form-select form-control form-control-sm select2`}
                      >
                        <option selected value={""}>Select Town</option>
                        {towns.map((townsObject, index) => (
                          <option key={townsObject} selected={townsObject.id == town} value={townsObject.id}>
                            {townsObject.name}
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
        <div className="col-lg-12">
          <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
            <div className="iq-card-body">
              <div className="row no-gutters">
                {grounds.length > 0 && !isLoading &&
                    grounds.map((groundObject, index) => (
                      <GroundListCard
                        key={country.id + "-" + groundObject.slug + index}
                        groundLongName={(groundObject.name)}
                        shortName={groundObject.shortName}
                        capacity={groundObject.capacity}
                        groundImage={FindGroundImage(groundObject)}
                        groundProfile={FindGroundProfile(groundObject)}
                        colClass={groundColClass}
                        cardClass={groundCardClass}
                      />
                    ))
                  }
                  {
                    isLoading && <div className="col-lg-12">
                      <LoadingSpinnerComponent cardClass={"m-0"} />
                    </div>
                  }
                  
                  {
                    page+1 != 0 && (
                      <div className="col-lg-12 mt-5">

                    <ReactPaginate
                      forcePage={page}
                      containerClassName={"pagination mb-0 justify-content-center"}
                      pageClassName={"page-item"}
                      pageLinkClassName="page-link"
                      activeClassName={"active"}
                      nextLinkClassName="page-link"
                      nextClassName="page-item"
                      previousClassName="page-item"
                      previousLinkClassName="page-link"
                      breakClassName="page-item"
                      breakLinkClassName="page-link"
                      disabledLinkClassName="disabled"
                      initialPage={page}
                      renderOnZeroPageCount={null}
                      onPageChange={(event) => setPage(event.selected)}
                      pageCount={Math.ceil(total_count.current / SIZE.current)}
                      breakLabel="..."
                    />
                    <div className="d-flex justify-content-center mb-1">
                      <span className="card-text">
                        <small className="text-muted">
                          Showing {page + 1} - {Math.ceil(total_count.current / SIZE.current)} of {total_count.current}
                        </small>
                      </span>
                    </div>
                  </div>
                    )
                  }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


export default CountryGroundsComponent;
