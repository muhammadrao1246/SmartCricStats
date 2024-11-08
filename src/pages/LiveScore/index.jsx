import React, { useState } from "react";
import { Link, useLocation, useOutletContext } from "react-router-dom";
import axios from "axios";


import teamPlaceholder from 'src/assets/images/team_placeholder.svg'

import MatchTab from "src/components/match/TabContent";
import "src/assets/css/matches.css";
import TabList from "src/components/Layouts/TabList";


let placeholder_data = (status)=>{return {
  teams: [
    {
      "abbreviation": "TEAM A",
      "shortName": "TEAM A",
      "image": teamPlaceholder,
      "score": (status != 'UPCOMING' ? "195-3" : null),
      "scoreInfo": "19.5/20 Ov"
    },
    {
      "abbreviation": "TEAM B",
      "shortName": "TEAM B",
      "image": teamPlaceholder,
      "score": (status != 'UPCOMING' ? "195-3" : null),
      "scoreInfo": "19.5/20 Ov"
    }
  ],
  match: {
    "batting": (status != "UPCOMING" && status != "RESULT") ? "TEAM A" : null,
    "format": "TEST",
    "title": "1st Test",
    "status": status,
    "statusInfo": "Live Matches Are Being Loaded..",
    "startDate": "2024-02-23T00:00:00.000Z",
    "startTime": "2024-02-23T04:00:00.000Z",
    "endDate": "2024-02-27T00:00:00.000Z"
  },
  stadium:{
    "shortName": "Stadium"
  },
  series:{
    "shortName": "Series",
    "isTrophy": false
  }
}
}

// Tab array will be passed to tab list component 
// so the component can create tab items with specific routes and having certain names on them
let TAB_ARRAY = [
  {route: 'live', name: "Live Score"},
  {route: 'upcoming', name: "Upcoming"},
  {route: 'results', name: "Results"},
]

const url_to_status_map = {
  "live": "LIVE",
  "upcoming": "UPCOMING",
  "result": "RESULT"
}

let seconds = 0

let placeholder_data_array = [
  ...Array.from({ length: 20 }, value => {
    value = placeholder_data("LIVE");
    return value
  }),
  ...Array.from(
    { length: 20 },
    value => {
      value = placeholder_data("UPCOMING");
      return value
    }
  ),
  ...Array.from(
    { length: 20 },
    value => {
      value = placeholder_data("RESULT");
      return value
    }
  ),
];

export default function Matches() {
  
  const [progress, setProgress] = useOutletContext();

  const params = new URLSearchParams(useLocation().search)

  const [tab, setTab] = useState(params.size > 0 ? params.get("tab", "live") : "live")
  
  // const [data, setData] = useState(placeholder_data_array)
  // const [data, setData] = useState(null)
  // const [live, setLive] = useState(true)
  
  
  // console.log(tab)
  // console.log(data)
  

    

  return (
    <>
      {/* Page Content  */}
      <div className="col-lg-8">
        <div className="row">
          <div className="col-lg-12">
          <TabList 
                key={tab+"=tabs"}
                tabArray={TAB_ARRAY}
                onClick={setTab}
              
                currentTab={tab}
              />
          </div>
          <div className="col-lg-12">
            <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
              {/* <div className="iq-card-header d-flex justify-content-between">
                
              </div> */}
              {
                <MatchTab
                key={tab}
                  tab={tab}
                />
              }
              
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="row">
          <div className="col-lg-12">
            
          </div>
        </div>
      </div>
    </>
  );
}
