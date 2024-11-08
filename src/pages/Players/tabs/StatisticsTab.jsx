import React from "react";

import teamPlaceholder from "src/assets/images/team_placeholder.svg";
import playerPlaceholder from "src/assets/images/player_placeholder.svg";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import TableMaker from "src/components/Layouts/TableMaker";


// dont show seasons or span column for these categories 
let ExemptSeasonColumnsFor = [
  "By Years",
  "By Seasons",
]

// columns that will be printed per role selected
let ColumnsForPerRole = {
  Batting: {
    "_id" : "",
    "seasons": "Span",
    "matches": "Mat.",
    "innings": "Inn.",
    "runs": "Runs",
    "highestRuns": "HS",
    "average": "Avg.",
    "balls": "Balls",
    "strikeRate": "SR",
    "ducks": "Ducks",
    "100s": "100s",
    "50s": "50s",
    "4s": "4s",
    "6s": "6s",
  },
  Bowling: {
    "_id" : "",
    "seasons": "Span",
    "matches": "Mat.",
    "innings": "Inn.",
    "overs": "Overs",
    "maidens": "Mdns",
    "runs": "Runs",
    "wickets": "Wkts",
    "bestBowlingFigure": "BBI",
    "highestRunsConcededInAnInnings": "HRC",
    "runsPerWicketAverage": "Avg.",
    "economy": "Econ",
    "strikeRatePerWicketForOvers": "SR",
    "4w": "4w",
    "5w": "5w",
    // "10w": "10w",
  },
  "All-Rounder": {}
}

let CellPropsPerRole = {
  Batting: {
    _id: { style: { width: "20%", fontWeight: "bold" } },
    runs: { style: { fontWeight: "bold" } },
  },
  Bowling: {
    _id: { style: { width: "20%", fontWeight: "bold" } },
    wickets: { style: { fontWeight: "bold" } },
  },
  "All-Rounder": {}
}

// select boxes options that will be rendered
let format_options = [
  "TEST", "ODI", "T20"
]
let role_options = [
  "Batting",
  "Bowling",
  "All-Rounder"
]

// player object will be passed from parent component
function StatisticsTab({ player }) {

  // going to use to update progress bar percentage
  const [progress, setProgress] = useOutletContext();

  const [format, setFormat] = React.useState("TEST")
  const [role, setRole] = React.useState("Batting")
  const [data, setData] = React.useState(null)


  // fetching player stats
  React.useEffect(()=>{
    // setting progress bar to 60 percentage
    setProgress(60)
    // making a network request to server to fetch stats data
      fetch(`http://127.0.0.1:8000/api/players/${player.slug}/stats`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          format: format,
          role: role
        }),
      })
      .then(response=>response.json())
      .then(response=>{
        setData(response.data)
        setProgress(100)
      })
      .catch(error=>{
        console.log(error)
      })
      
  }, [player, format, role])

  let DATA_TO_BE_RENDERED_INSIDE_COMPONENT = null

  // if data is loading
  if (data == null) {
    DATA_TO_BE_RENDERED_INSIDE_COMPONENT = 
    (<div className="col-lg-12">
      <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
        <div className="iq-card-body">
          <div className="row">
            <div className="col-lg-12">
              <div className="d-flex w-100 justify-content-center p-3">
                <div
                  className="spinner-border text-muted font-weight-bold"
                  role="status"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
  }
  // if no data returned against query 
  else if (Object.keys(data).length == 0) {
    DATA_TO_BE_RENDERED_INSIDE_COMPONENT= 
    (
        <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
          <div className="iq-card-body">
            <div className="row">
              <div className="col-lg-12">
                <div className="d-flex w-100 justify-content-center">
                  <h5>No Data Found</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
  // if provided data against the filters for player
  else{
    DATA_TO_BE_RENDERED_INSIDE_COMPONENT = (
      <>
      {
      Object.keys(data).map((statCategory, index) => (
        <>
          {data[statCategory].length > 0 && (
            <div key={index} className="col-lg-12">
              <div className="iq-card iq-card-block iq-card-stretch iq-card-height p-0">
                <div className="iq-card-body p-0">
                  <div className="main-table-heading p-3">{statCategory}</div>
                  <div className="table-responsive">
                    <TableMaker
                      key={role+"-"+format}
                      columnNameMapObject={ColumnsForPerRole[role]}
                      rowsData={data[statCategory]}
                      columnsToShow={ExemptSeasonColumnsFor.includes(statCategory) ? Object.keys(ColumnsForPerRole[role]).filter(col=> col != "seasons") : Object.keys(ColumnsForPerRole[role])}
                      cellsProps={CellPropsPerRole[role]}
                      columnProps={{}}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ))}
      </>
    )
  }
  
  //  if some data provided then print all
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="iq-card iq-card-block iq-card-stretch iq-card-height p-0">
          <div className="iq-card-header d-flex justify-content-between">
            <div className="iq-header-title">
              <h4 className="card-title"> Career Statistics </h4>
            </div>
            <div className="iq-card-header-toolbar d-flex align-items-center">
                <select
                    className="form-select form-control form-control-sm select2"
                    style={{width: "200px"}}
                    onChange={(e) => {setData(null);setFormat(e.target.value)}}
                  >
                    {
                      format_options.map((value, index) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))
                    }
                  </select>
              <select
                className="form-select form-control form-control-sm select2"
                style={{width: "200px"}}
                onChange={(e) => {setData(null);setRole(e.target.value)}}
              >
                {
                  role_options.map((value, index) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))
                }
              </select>
            </div>
          </div>
        </div>
      </div>
      {DATA_TO_BE_RENDERED_INSIDE_COMPONENT}
    </div>
  );
}


export default StatisticsTab;
