// import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";


import { FindGroundShortName, FindMatchLink, FindSeriesLongName, FindSeriesShortName, FindTeamImage, FindTeamLongName, FindTeamShortName } from "src/utils/utils";


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


  

SmallMatchScoreCard.propTypes = {
    team1 : PropTypes.object.isRequired,
    team2 : PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    stadium: PropTypes.object,
    series: PropTypes.object.isRequired,
    scores: PropTypes.object.isRequired,
}
function SmallMatchScoreCard({team1, team2, match, stadium, series, scores}) {
  // console.log(team1)
  // console.log(team2)
  
    let matchTime = new Date(match.startTime)
    let matchDate = matchTime.toLocaleDateString("en-US", {dateStyle:"long"})

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
      <Link
        to={FindMatchLink(match.slug, series)}
        // to={`${ROUTES.SERIES}/${series.shortName}/${(team1.shortName + " vs " + team2.shortName)}`}
        className="card custom-card rounded border scorecard-container p-2"
        title={FindSeriesShortName(series) + " • " + FindTeamShortName( team1 ) + " vs " + FindTeamShortName( team2 )}
      >
        <div className="row no-gutters align-items-center">
          <div className="col-sm-12">
            <div className="scorecard-head d-flex align-items-center justify-content-between">
              <div
                className="text-dark d-flex align-items-center text-truncate"
                style={{ width: "85%", gap: "5px" }}
              >
              <span className="scorecard-match">{match.title}</span> •
              <span className="scorecard-event">{FindSeriesShortName(series)}</span> •
              <span className="scorecard-venue">{FindGroundShortName(stadium)}</span> •
              <span className="scorecard-venue">{matchDate}</span>
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
                title={FindTeamLongName( team1 )}
              >
                <img
                  src={FindTeamImage(team1)}
                  className="iq-card-icon scorecard-image mr-2"
                />
                {FindTeamShortName( team1 )}
                { 
                  (match.lastBatting == FindTeamLongName( team1 ) && match.status != "RESULT") &&
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
                title={FindTeamLongName( team2 )}
              >
                  { 
                  (match.lastBatting == FindTeamLongName( team2 ) && match.status != "RESULT") &&
                      (
                      <i
                          style={{ fontSize: "8px" }}
                          className="fa fa-circle text-danger ml-2 mr-2
                                  "
                      ></i>
                      )
                  }
                  {FindTeamShortName(team2)}
                <img
                src={FindTeamImage(team2)}
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
                        scores[match.teamOneName] != null &&
                        (
                          <div
                          className="text-dark d-flex align-items-center scorecard-text"
                          style={{ width: "50%" }}
                          >
                          {
                            scores[match.teamOneName].score
                          }
                          <span className="scorecard-overs mr-1 ml-1">
                            {
                              scores[match.teamOneName].overs != null ? ("("+scores[match.teamOneName].overs+" overs)") : null
                            }
                          </span>
                          </div>
                      )
                  }
                  { 
                    scores[match.teamTwoName] != null &&
                        (
                          <div
                          className="text-dark d-flex align-items-center justify-content-end scorecard-text"
                          style={{ width: "50%" }}
                          >
                          <span className="scorecard-overs mr-1 ml-1">
                            {
                              scores[match.teamTwoName].overs != null ? ("("+scores[match.teamTwoName].overs+" overs)") : null
                            }
                          </span>
                            {
                              scores[match.teamTwoName].score
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
                 match.statusText != null  && match.statusText != "" ? match.statusText.replace("{{MATCH_START_HOURS}}", MATCH_START_HOURS).replace("{{MATCH_START_MINS}}", MATCH_START_MINUTES): <>&nbsp;</>
                }
            </div>
          </div>
        </div>
      </Link>
  );
}

export default SmallMatchScoreCard;
