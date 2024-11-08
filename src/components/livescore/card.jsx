// import React from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ROUTES } from "src/routes/urls";


let status_map = {
    STUMPS: "stumps",
    LIVE: "live",
    RESULT: "result",
    "STRATEGIC TIMEOUT": "stumps",
  };

let format_map = {
    T20I : "text-danger",
    T20: "text-danger",
    ODI : "text-info",
    TEST : "text-success",
}



Card.propTypes = {
    team1 : PropTypes.object.isRequired,
    team2 : PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    stadium: PropTypes.object.isRequired,
    series: PropTypes.object.isRequired
}
function Card({team1, team2, match, stadium, series}) {
  // console.log(team1)
  // console.log(team2)

    let matchTime = new Date(match.startTime)
    let current = new Date(Date.now())
    let MATCH_START_HOURS = Math.abs(matchTime - current) / 36e5; // in hours
    let MATCH_START_MINUTES = (MATCH_START_HOURS * 60) // in number

    let TODAY_or_TOMORROW = MATCH_START_HOURS >= 24.0 ? "Tomorrow" : "Today" ;
    let MATCH_FORMATTED_TIME = matchTime.toLocaleTimeString('en-US', {hour: "numeric", minute:"numeric", hour12:true})
    MATCH_START_MINUTES = MATCH_START_MINUTES < 1.0 ? "" : parseInt(Math.abs(MATCH_START_HOURS - parseInt(MATCH_START_HOURS)) * 60) + " mins"
    MATCH_START_HOURS = MATCH_START_HOURS < 1.0 ? "" : parseInt(MATCH_START_HOURS) + " hrs"
    
    // console.log(matchTime)
    // console.log(current)
    // console.log(MATCH_START_HOURS)
    // console.log(MATCH_START_MINUTES)
  
  return (
    // <motion.div key={team1.name+team2.name}
    //   initial="hidden"
    //   whileInView="visible"
    //   transition={{ duration: .1 }}
    //   variants={{
    //     visible: { opacity: 1 },
    //     hidden: { opacity: 0 }
    //   }} 
    //     >  
      <Link
        to={""}
        // to={`${ROUTES.SERIES}/${series.shortName}/${(team1.shortName + " vs " + team2.shortName)}`}
        className="card custom-card rounded border scorecard-container p-2"
        title={series.shortName + " • " + team1.shortName + " vs " + team2.shortName }
      >
        <div className="row no-gutters align-items-center">
          <div className="col-sm-12">
            <div className="scorecard-head d-flex align-items-center justify-content-between">
              <div
                className="text-dark d-flex align-items-center text-truncate"
                style={{ width: "85%", gap: "5px" }}
              >
                <span className="scorecard-match">{match.title}</span> •
                <span className="scorecard-event">{series.shortName}</span> •
                <span className="scorecard-venue">{stadium.shortName}</span>
              </div>
              <div
                className={`scorecard-head-format ${format_map[match.format]} d-flex align-items-center justify-content-end font-weight-bold`}
                style={{ width: "15%" }}
              >
                {match.format.toUpperCase()}
              </div>
            </div>
          </div>
          <div className="col-sm-12 scorecard-text">
            <div className="d-flex align-items-center justify-content-between">
              <div
                className="text-dark d-flex align-items-center"
                style={{ width: "100%" }}
                title={team1.longName}
              >
                <img
                  src={team1.image}
                  className="iq-card-icon scorecard-image mr-2"
                />
                {team1.abbreviation}
                { 
                  (match.batting == team1.shortName && match.status != "RESULT") &&
                      (
                      <i
                          style={{ fontSize: "8px" }}
                          className="fa fa-circle text-danger ml-2 mr-2
                                  "
                      ></i>
                      )
                  }
              </div>

              {
                
                  <div
                    className={`text-center text-truncate font-weight-bold scorecard-status-${
                      Object.keys(status_map).includes(match.status) ? status_map[match.status] : "stumps"
                    }`}
                    style={{ width: "100%", fontSize: "" }}
                  >
                    {match.status}
                  </div>
                
              }
              
              <div
                className="text-dark d-flex align-items-center justify-content-end"
                style={{ width: "100%" }}
                title={team2.longName}
              >
                  { 
                  (match.batting == team2.shortName && match.status != "RESULT") &&
                      (
                      <i
                          style={{ fontSize: "8px" }}
                          className="fa fa-circle text-danger ml-2 mr-2
                                  "
                      ></i>
                      )
                  }
                {team2.abbreviation}
                <img
                  src={team2.image}
                  className="iq-card-icon  scorecard-image ml-2"
                />
              </div>
            </div>
          </div>
          <div className="col-sm-12">
            <div className="row">
              <div className="col-sm-12">
                <div className="scorecard-score-row d-flex align-items-center justify-content-between">
                  { 
                  team1.score != null &&
                      (
                          <div
                          className="text-dark d-flex align-items-center scorecard-text"
                          style={{ width: "50%" }}
                          >
                          {
                            team1.score
                          }
                          <span className="scorecard-overs mr-1 ml-1">
                              {
                                team1.overs != null ? ("("+team1.overs+")") : null
                              }
                          </span>
                          </div>
                      )
                  }
                  { 
                  team2.score != null &&
                      (
                          <div
                          className="text-dark d-flex align-items-center justify-content-end scorecard-text"
                          style={{ width: "50%" }}
                          >
                          <span className="scorecard-overs mr-1 ml-1">
                              {
                                team2.overs != null ? ("("+team2.overs+")") : null
                              }
                          </span>
                              {
                                team2.score
                              }
                          </div>
                      )
                  }

                  {
                    match.status == "UPCOMING" && 
                    (
                      <div
                      className="text-dark d-flex align-items-center justify-content-center scorecard-text"
                      style={{ width: "100%" }}
                      >
                        {
                          TODAY_or_TOMORROW + " " + MATCH_FORMATTED_TIME
                        }
                      </div>
                    )
                  }
                  &nbsp;
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-12">
            <div className="scorecard-match-status-text border-top d-flex align-items-center justify-content-between text-truncate">
              {
                match.statusInfo != null ? match.statusInfo.replace("{{MATCH_START_HOURS}}", MATCH_START_HOURS).replace("{{MATCH_START_MINS}}", MATCH_START_MINUTES) : (<>&nbsp;</>)
              }
            </div>
          </div>
        </div>
      </Link>
    // </motion.div>
  );
}

export default Card;
