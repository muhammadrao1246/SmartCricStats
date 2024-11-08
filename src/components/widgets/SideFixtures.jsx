import React from "react";
import { Link } from "react-router-dom";
import SmallMatchScoreCard from "../livescore/SmallMatchScoreCard";

import "src/assets/css/matches.css"
import ViewMoreAnchor from "../Layouts/ViewMoreAnchor";

let tabs = { result: "Results", upcoming: "Upcoming"}

function SideFixtures({ data, viewMoreLink, onClick }) {

  let [state, setState] = React.useState(data != null ? data["result"].length > 0 ? "result" : "upcoming" : "result");

  if (data == null) {
    return  <></>
  }
  else if(data.total == 0){
    return <></>
  }

  return (
    <div className="iq-card iq-card-block iq-card-stretch overflow-hidden side-fixture-container">
      <ul
        className="nav nav-tabs justify-content-center w-100 m-0"
        role="tablist"
      >
        {
            Object.keys(tabs).map((route, index)=>(
              <>
              {
                data[route].length > 0 && (
                  <li className="nav-item tab-item" key={"side-"+route}>
                      <Link
                          to="javascript:void(0)"
                          className={`nav-link border-none ${state === route ? " active" : ""}`}
                          data-toggle="tab"
                          role="tab"
                          onClick={()=>{setState(route)}}
                      >
                          {tabs[route]}
                      </Link>
                  </li>
                )
              }
              </>
            ))
        }
      </ul>
      <div className="iq-card-body">
        <div className="d-flex flex-column" style={{rowGap:"1rem"}}>
            {
                data[state].map((match, index)=>(
                    <SmallMatchScoreCard
                    key={state+"-"+match.slug}
                        team1={match["teams"][match["teamOneName"]]}
                        team2={match["teams"][match["teamTwoName"]]}
                        match={match}
                        stadium={match["ground"]}
                        series={match["series"]}
                        scores={match["scoresText"]}
                        
                    />

                ))
            }
        </div>
      </div>
      <ViewMoreAnchor onClick={onClick} text={"View All Matches"} link={viewMoreLink} />
    </div>
  );
}

export default SideFixtures;
