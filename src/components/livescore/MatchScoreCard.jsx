import React from "react";
import PropTypes from "prop-types";
import { FindGroundShortName, FindSeriesLongName, FindSeriesShortName, FindSeriesSlugOrCreateDummy, FindTeamImage, FindTeamLongName, FindTeamShortName } from "src/utils/utils";
import axios, { Axios } from "axios";

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



MatchScoreCard.propTypes = {
    team1 : PropTypes.object.isRequired,
    team2 : PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    stadium: PropTypes.object,
    series: PropTypes.object.isRequired,
    scores: PropTypes.object.isRequired,
}
let seconds = 0
function MatchScoreCard({team1, team2, match, stadium, series, scores}) {
  // console.log(team1)
  // console.log(team2)
  
  let [liveScore, setLiveScore] = React.useState(scores)
  let [updatedMatch, setMatch] = React.useState(match)

  React.useEffect(()=>{
    if (updatedMatch.state != "LIVE") {
      return
    }
    const source = axios.CancelToken.source();
    setTimeout(() => {
        axios.get(`http://127.0.0.1:8000/api/series/${FindSeriesSlugOrCreateDummy(series)}/${match.slug}/livescore`, {
          method: 'GET',
          cancelToken: source.token
        })
        .then(response=>{
          seconds = 10000
          setMatch(response.data.data)

          setLiveScore(response.data.data.scoresText)
        })
        .catch(error=>{
          console.log(error)
        })
        .finally(()=>{
          
        })
        
    return ()=>{
      source.cancel();
    }
    }, seconds);

  }, [liveScore])


    let matchTime = new Date(updatedMatch.startTime)
    let matchDate = matchTime.toLocaleDateString("en-US", {dateStyle:"full"})

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
    <div
      className="detail-scorecard-container p-0"
      title={FindSeriesShortName(series) + " • " + FindTeamShortName( team1 ) + " vs " + FindTeamShortName( team2 ) }
    >
      <div className="row no-gutters align-items-center">
        <div className="col-sm-12">
          <div className="detail-scorecard-head d-flex align-items-center justify-content-between">
            <div
              className="text-dark d-flex align-items-center text-truncate"
              style={{ width: "85%", gap: "5px" }}
            >
              <span className="detail-scorecard-match">{updatedMatch.title}</span> •
              <span className="detail-scorecard-event">{FindSeriesLongName(series)}</span> •
              <span className="detail-scorecard-venue">{FindGroundShortName(stadium)}</span> •
              <span className="detail-scorecard-venue">{matchDate}</span>
            </div>
            <div
              className={`detail-scorecard-head-format ${format_map[updatedMatch.format]} d-flex align-items-center justify-content-end font-weight-bold`}
              style={{ width: "15%" }}
            >
              {updatedMatch.format.toUpperCase()}
            </div>
          </div>
        </div>
        <div className="col-sm-12 detail-scorecard-text">
          <div className="d-flex align-items-center justify-content-between">
            <div
              className="text-dark d-flex align-items-center"
              style={{ width: "100%" }}
              title={FindTeamLongName( team1 )}
            >
              <img
                src={FindTeamImage(team1)}
                className="iq-card-icon detail-scorecard-image mr-2"
              />
              {FindTeamShortName( team1 )}
              { 
                (updatedMatch.lastBatting == FindTeamLongName( team1 ) && updatedMatch.status != "RESULT") &&
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
                  className={`text-center font-weight-bold detail-scorecard-status-${
                    Object.keys(status_map).includes(updatedMatch.status) ? status_map[updatedMatch.status] : "stumps"
                  }`}
                  style={{ width: "100%", fontSize: "" }}
                >
                  {updatedMatch.status}
                </div>
              
            }
            
            <div
              className="text-dark d-flex align-items-center justify-content-end"
              style={{ width: "100%" }}
              title={FindTeamLongName( team2 )}
            >
                { 
                (updatedMatch.lastBatting == FindTeamLongName( team2 ) && updatedMatch.status != "RESULT") &&
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
                className="iq-card-icon  detail-scorecard-image ml-2"
              />
            </div>
          </div>
        </div>
        <div className="col-sm-12">
          <div className="row">
            <div className="col-sm-12">
              <div className="detail-scorecard-score-row d-flex align-items-center justify-content-between">
                { 
                liveScore[updatedMatch.teamOneName] != null &&
                    (
                        <div
                        className="text-dark d-flex align-items-center detail-scorecard-text"
                        style={{ width: "50%" }}
                        >
                        {
                          liveScore[updatedMatch.teamOneName].score
                        }
                        <span className="detail-scorecard-overs mr-1 ml-1">
                            {
                              liveScore[updatedMatch.teamOneName].overs != null ? ("("+liveScore[updatedMatch.teamOneName].overs+" overs)") : null
                            }
                        </span>
                        </div>
                    )
                }
                { 
                liveScore[updatedMatch.teamTwoName] != null &&
                    (
                        <div
                        className="text-dark d-flex align-items-center justify-content-end detail-scorecard-text"
                        style={{ width: "50%" }}
                        >
                        <span className="detail-scorecard-overs mr-1 ml-1">
                            {
                              liveScore[updatedMatch.teamTwoName].overs != null ? ("("+liveScore[updatedMatch.teamTwoName].overs+" overs)") : null
                            }
                        </span>
                            {
                              liveScore[updatedMatch.teamTwoName].score
                            }
                        </div>
                    )
                }

                {
                  updatedMatch.status == "UPCOMING" && 
                  (
                    <div
                    className="text-dark d-flex align-items-center justify-content-center detail-scorecard-text"
                    style={{ width: "100%" }}
                    >
                      {
                        TODAY_or_TOMORROW + " " + MATCH_FORMATTED_TIME
                      }
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-12">
          <div className="detail-scorecard-match-status-text border-top d-flex align-items-center justify-content-between text-truncate">
            {
                 updatedMatch.statusText != null  && updatedMatch.statusText != "" ? updatedMatch.statusText.replace("{{MATCH_START_HOURS}}", MATCH_START_HOURS).replace("{{MATCH_START_MINS}}", MATCH_START_MINUTES): <>&nbsp;</>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchScoreCard;
