import React from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import tinycolor from "tinycolor2"

import { FindPlayerFaceImage, FindPlayerName, FindPlayerProfile, FindPlayerTeamByName, FindTeamShortName } from "src/utils/utils";



function OverviewTab({match}) {

  // going to use to update progress bar percentage
  const [progress, setProgress] = useOutletContext();

  const {series_slug, match_slug} = useParams()

  const [data, setData] = React.useState(null)


  // fetching player stats
  React.useEffect(()=>{
    // setting progress bar to 60 percentage
    setProgress(60)
    // making a network request to server to fetch stats data
      fetch(`http://127.0.0.1:8000/api/series/${series_slug}/${match_slug}/summary`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(response=>response.json())
      .then(response=>{
        setData(response.data)
        setProgress(100)
      })
      .catch(error=>{
        console.log(error)
      })
      
  }, [match])

  if (data == null) {
    return (<div className="col-lg-12">
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

  return (
    <>
      {data.matchAwards.map((value, index) => (
        <div className="col-lg-6" key={"award" + index}>
          <div className="iq-card iq-card-block iq-card-stretch iq-card-height p-0">
            <div className="iq-card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="overview-mom-container flex-column d-flex justify-content-center">
                  <div className="">{value.award}</div>
                  <div className="overview-mom-player-name">
                    {FindPlayerName(value.player)}
                    &nbsp;
                    {
                    typeof(FindPlayerTeamByName(match.teams, match.players, FindPlayerName(value.player))) != "string" ?
                        FindTeamShortName(FindPlayerTeamByName(match.teams, match.players, FindPlayerName(value.player)))
                      :
                      "("+FindPlayerTeamByName(match.teams, match.players, FindPlayerName(value.player))+")"
                      }
                  </div>
                </div>

                <img
                  src={FindPlayerFaceImage(value.player)}
                  alt=""
                  className="overview-mom-player-avatar"
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      {data.bestPerformances.map((value, index) => (
        <InningsBestPerformances
          teamMap={match.teams}
          playerIdMap={match.idToPlayer}
          inning={value}
          key={match.slug + value.inningNumber}
        />
      ))}
    </>
  );
}


function InningsBestPerformances({teamMap, playerIdMap, inning}){
  // console.log(teamMap)
  return (
    
    <div className="col-lg-12">
    <div className="iq-card iq-card-block iq-card-stretch iq-card-height p-0">
      <div className="iq-card-body p-0">
        <div className="row">
          <div className="col-lg-12">
            <div className=" d-flex rounded-top border-top justify-content-center p-2 overview-innings-card-head" style={{backgroundColor: (typeof(teamMap[inning.team]) != "string" ? teamMap[inning.team].color != null ? tinycolor(teamMap[inning.team].color).darken(10) : "" : "")}}>
              {inning.team} • {inning.inningNumber > 2 ? "2nd Innings" : "1st Innings"} • {inning.runs}{inning.wickets < 10 ? "/"+inning.wickets : ""} • {inning.overs + " Overs"}
            </div>
          </div>
          <div className="col-lg-12">
            <div className="row pl-3 pr-3 pb-0 pt-3">
              <div className="col-lg-6">
                <div className="row">
                  {
                    inning.BATTING.map((value, index)=>(
                      <div className="col-lg-12 pl-3 pb-2" key={inning.inningNumber+"BATTER-"+value["player"]}>
                        <div className="d-flex align-items-center justify-content-start overview-player-container">
                          <img
                            src={FindPlayerFaceImage(playerIdMap[value["player"]])}
                            alt=""
                            className="overview-player-avatar"
                          />
                          <span className="d-flex flex-column justify-content-center h-100">
                            <Link to={FindPlayerProfile(playerIdMap[value["player"]])} className={`text-dark overview-player-name ${(typeof(playerIdMap[value["player"]]) != "string" ? "text-anchor" : "")}`}>
                            {FindPlayerName(playerIdMap[value["player"]])}
                              </Link>
                            <div className="overview-player-performance">
                              {value["runs"]} ({value["balls"]})
                            </div>
                          </span>
                        </div>
                      </div>
                    ))
                  }
                  
                </div>
              </div>
              <div className="col-lg-6">
                <div className="row">
                  {
                    inning.BOWLING.map((value, index)=>(
                      <div className="col-lg-12 pr-3 pb-2"  key={inning.inningNumber+"BOWLING-"+value["player"]}>
                        <div className="d-flex align-items-center justify-content-end overview-player-container">
                          <span className="d-flex flex-column justify-content-center align-items-end h-100">
                            <Link to={FindPlayerProfile(playerIdMap[value["player"]])} className={`text-dark overview-player-name ${(typeof(playerIdMap[value["player"]]) != "string" ? "text-anchor" : "")}`}>
                            {FindPlayerName(playerIdMap[value["player"]])}
                            </Link>
                            <div className="overview-player-performance">
                              {value["overs"]} Ov. ({value["runs"]}-{value["wickets"]})
                            </div>
                          </span>
                          <img
                            src={FindPlayerFaceImage(playerIdMap[value["player"]])}
                            alt=""
                            className="overview-player-avatar"
                          />
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default OverviewTab;
