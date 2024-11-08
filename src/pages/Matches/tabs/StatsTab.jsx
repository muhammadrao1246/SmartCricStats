import axios from "axios";
import React from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";


import balls from "src/assets/images/tilted-ball.png";
import bowled from "src/assets/images/wicket.png";
import batAndBall from "src/assets/images/bat-and-ball.png";

import ChartComponent from "src/charts/ChartComponent";

import { FindPlayerFaceImage, FindPlayerName, FindPlayerProfile, FindTeamColor, FindTeamImage, FindTeamLongName, RunRateStringMaker } from "src/utils/utils";
import tinycolor from "tinycolor2";
import { WormGraphOptions, GLOBAL_FONT, RunRateGraphOptions, RunsPerOverGraphOptions, tooltipFooterColor } from "src/charts/graphSettings";

const DummyDataSet = [
  {
    team: {
      longName: "England",
      color: "#dc3545",
    },
    data: [
        { runrate: 0, over: 0 },
      { runrate: 50, over: 1 },
      { runrate: 55, over: 2 },
      { runrate: 25, over: 3 },
      { runrate: 65, over: 4, wicket: 10 },
      { runrate: 15, over: 5 },
    ],
  },
  {
    team: {
      longName: "Pakistan",
      color: "#28a745",
    },
    data: [
    { runrate: 0, over: 0 },
      { runrate: 8.5, over: 1, wicket: 1 },
      { runrate: 2.5, over: 2 },
      { runrate: 8.5, over: 3 },
      { runrate: 12.5, over: 4 },
      { runrate: 10.5, over: 5 },
    ],
  },
];
// stats to be created
/* run per over graph
*/
// let placeholder = {
//   "First Innings": {},
//   "Second Innings": {}
// }
function StatsTab({match}) {

  // going to use to update progress bar percentage
  const [progress, setProgress] = useOutletContext();

  const { series_slug, match_slug } = useParams();

  const [data, setData] = React.useState(null);
  // innings selection
  const [currentInnings, setCurrentInnings] = React.useState(null);

  // fetching player stats
  React.useEffect(() => {
    // setting progress bar to 60 percentage
    setProgress(60);
    // making a network request to server to fetch data
    
    axios.get(
      `http://127.0.0.1:8000/api/series/${series_slug}/${match_slug}/statistics`,
      {
        method: "GET",
      }
    )
      .then((response) => {
        let data= response.data.data
        setCurrentInnings(Object.keys(data).length > 0 ? Object.keys(data)[0] : null)
        setData(data);
        setProgress(100);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [match]);

  if (data == null) {
    return (
      <div className="col-lg-12">
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
      </div>
    );
  }
  else if (Object.keys(data).length == 0) {
    return (
      <div className="col-lg-12">
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
      </div>
    )
  }



  return (
    <>
      <div className="col-lg-12">
        <div
          className="mb-4 d-flex justify-content-start inning-tab flex-wrap pl-3 pr-3"
          style={{ gap: "10px" }}
        >
          {Object.keys(data).map((value, index) => (
            <button
              key={value}
              onClick={() => setCurrentInnings(value)}
              className={`btn btn-sm rounded-pill iq-waves-effect ${
                currentInnings == value
                  ? "btn-success disabled"
                  : "btn-outline-success"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      {
        data[currentInnings]["bestPerformances"]["BATTING"].length > 0 && (
          <>
          <div className="col-lg-12" >
            <div className="iq-card iq-card-block iq-card-stretch">
              <div className="iq-card-body pt-2 pb-2">
                <div className="scorecard-innings-head-text">
                  Best Performances - BATTER
                </div>
              </div>
            </div>
          </div>
          {
            data[currentInnings]["bestPerformances"]["BATTING"].map((battingStats, index)=>(
              <BatterPerformanceComponent key={currentInnings+"-"+"BATTING-"+index} statsData={battingStats} playerMap={match.players} />
            ))
          }
          </>
        )
      }

      {
        data[currentInnings]["bestPerformances"]["BOWLING"].length > 0 && (
          <>
          <div className="col-lg-12" >
            <div className="iq-card iq-card-block iq-card-stretch">
              <div className="iq-card-body pt-2 pb-2">
                <div className="scorecard-innings-head-text">
                  Best Performances - BOWLER
                </div>
              </div>
            </div>
          </div>
          {
            data[currentInnings]["bestPerformances"]["BOWLING"].map((bowlingStats, index)=>(
              <BowlerPerformanceComponent key={currentInnings+"-"+"BOWLING-"+index} statsData={bowlingStats} playerMap={match.players} />
            ))
          }
          </>
        )
      }


      {
        data[currentInnings]["partnerships"].length > 0 && (
          <>
          <div className="col-lg-12" >
            <div className="iq-card iq-card-block iq-card-stretch">
              <div className="iq-card-body pt-2 pb-2">
                <div className="scorecard-innings-head-text">
                  Batting Partnerships
                </div>
              </div>
            </div>
          </div>
          <PartnershipComponent key={currentInnings+"-partnerships"} partnershipData={data[currentInnings]["partnerships"]} teamMap={match.teams} />
          </>   
        )
      }



      <div className="col-lg-12">
        <div className="iq-card iq-card-block iq-card-stretch">
          <div className="iq-card-body">
            <div className="d-flex w-100 justify-content-between">
              <div className="scorecard-innings-head-text">
                Manhattan
              </div>
              <div className="stat-graph-highlight-container">
                {
                  Object.keys(match.teams).map((teamName, index)=>(
                    <span className="" key={FindTeamLongName(match.teams[teamName])}>
                      <i
                        className={`fa fa-circle mr-2 stat-run-indicator stat-graph-highlight-sub-container`}
                        style={{color: FindTeamColor(match.teams[teamName])}}
                      ></i>
                      {FindTeamLongName(match.teams[teamName])}
                    </span>
                  ))
                }
              </div>
            </div>
            <div className="chart-container mt-3">
              {/* {console.log(DummyDataSet.map((team) => {
                        return team.data
                      }).reduce((x, current)=> current.length > x.length ? current : x ))} */}
              <ChartComponent
                key={currentInnings+"-"+0}
                id={"statsManhattan"}
                settings={
                  {
                    type: "bar",
                    data: {
                      labels: data[currentInnings]["graphsData"]["labels"],
                      datasets: data[currentInnings]["graphsData"]["teams"].map((data, index) => {
                        let teamColor = FindTeamColor(match.teams[FindTeamLongName(data.team)])
                        teamColor = teamColor == "" ? match.defaultColors[index] : teamColor
                        return {
                          data: data.manhattan,
                          pointRadius: data.pointRadius,
                          tension: 0.05,
                          fill: false,
                          label: FindTeamLongName(data.team),

                          backgroundColor: data.pointRadius.map((value)=>value > 0 ? tinycolor(teamColor).lighten(100).toHexString() : teamColor),
                          borderRadius: 10,
            
                          borderWidth: data.pointRadius.map((value)=>value > 0 ? 2 : 0),
                          borderColor: [teamColor],
                          hoverBorderColor: data.pointRadius.map((value)=>value > 0 ? tinycolor(teamColor).lighten(100).toHexString() : teamColor),
                          hoverBackgroundColor: data.pointRadius.map((value)=>value > 0 ? tinycolor(teamColor).darken(0).toHexString() : tinycolor(teamColor).lighten(10).toHexString()),
                          
                          // hoverBorderCapStyle: "butt",
                          pointStyle: "circle",
                          pointHoverBackgroundColor: tinycolor(teamColor).lighten(20).toHexString(),
                          pointHoverBorderColor: teamColor,
                        };
                      }),
                    },
                    options: {...RunsPerOverGraphOptions, ...{
                        plugins: {
                          legend: {
                            display: false,
                          },
                          tooltip: {
                              displayColors: false,
                              display: true,
                              position: "nearest",
                              
                              callbacks: {
                                  title: function (tooltipItem, Everything) {
                                    
                                    if (tooltipItem.length == 0) return;
                                      tooltipItem = tooltipItem[0]
                                      var dataset =  data[currentInnings]["graphsData"]["teams"][tooltipItem.datasetIndex];
                                      var pointRadius = dataset["pointRadius"][tooltipItem.dataIndex];
                                      if (pointRadius == 0) return;
                                      
                                      let commentaryObject = dataset["wicketsCommentary"][tooltipItem.dataIndex]

                                      let str = commentaryObject["title"]
                                      return str
                                  },
                                  label: function (tooltipItem, Everything) {

                                    var dataset =  data[currentInnings]["graphsData"]["teams"][tooltipItem.datasetIndex];
                                    var pointRadius = dataset["pointRadius"][tooltipItem.dataIndex];
                                    if (pointRadius == 0) return;
                                    
                                    let commentaryObject = dataset["wicketsCommentary"][tooltipItem.dataIndex]

                                    let str = commentaryObject["commentary"]
                                    return str
                                  },
                                  footer: function (tooltipItem, Everything) {
                                    
                                    if (tooltipItem.length == 0) return;
                                    tooltipItem = tooltipItem[0]
                                    var dataset =  data[currentInnings]["graphsData"]["teams"][tooltipItem.datasetIndex];
                                    var pointRadius = dataset["pointRadius"][tooltipItem.dataIndex];
                                    if (pointRadius == 0) return;
                                    
                                    let commentaryObject = dataset["wicketsCommentary"][tooltipItem.dataIndex]

                                    let str = RunRateStringMaker(commentaryObject["runRates"])
                                    return str
                                  },
                              },

                              filter: function (tooltipItem, Everything) {
                                
                                var dataset =  data[currentInnings]["graphsData"]["teams"][tooltipItem.datasetIndex];
                                var pointRadius = dataset["pointRadius"][tooltipItem.dataIndex];
                                if (pointRadius > 0) {
                                  return true
                                } else {
                                  return false
                                }
                              }
                          }
                        }
                    }}
                  }
                }
              />
            </div>
          </div>
        </div>
      </div>
              
      <div className="col-lg-12">
        <div className="iq-card iq-card-block iq-card-stretch">
          <div className="iq-card-body">
            <div className="d-flex w-100 justify-content-between">
              <div className="scorecard-innings-head-text">
                Run Rate Graph
              </div>
              <div className="stat-graph-highlight-container">
                {
                  Object.keys(match.teams).map((teamName, index)=>(
                    <span className="" key={FindTeamLongName(match.teams[teamName])}>
                      <i
                        className={`fa fa-circle mr-2 stat-run-indicator stat-graph-highlight-sub-container`}
                        style={{color: FindTeamColor(match.teams[teamName])}}
                      ></i>
                      {FindTeamLongName(match.teams[teamName])}
                    </span>
                  ))
                }
              </div>
            </div>
            <div className="chart-container mt-3">
            <ChartComponent
              key={currentInnings+"-"+1}
                id={"statsRunRate"}
                settings={
                  {
                    type: "line",
                    data: {
                      labels: data[currentInnings]["graphsData"]["labels"],
                      datasets: data[currentInnings]["graphsData"]["teams"].map((data, index) => {
                        let teamColor = FindTeamColor(match.teams[FindTeamLongName(data.team)])
                        teamColor = teamColor == "" ? match.defaultColors[index] : teamColor
                        return {
                          data: data.runRate,
                          pointRadius: data.pointRadius,
                          pointHoverRadius: data.pointRadius.map((value)=>value == 5 ? 10 : 0),
                          tension: 0.2,
                          fill: false,
                          label: FindTeamLongName(data.team),
                          
                          // borderWidth: 2,
                          borderColor: [teamColor],
                          // hoverBorderColor: [tinycolor(teamColor).lighten(20).toHexString()],
                          backgroundColor: tinycolor(teamColor).lighten(100).toHexString(),
                          // hoverBorderCapStyle: "butt",
                          pointHoverBackgroundColor: tinycolor(teamColor).lighten(30).toHexString(),
                          pointHoverBorderColor: teamColor,
                        };
                      }),
                    },
                    options: {...RunRateGraphOptions, ...{
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                            displayColors: false,
                            display: true,
                            position: "nearest",
                            
                            callbacks: {
                                title: function (tooltipItem, Everything) {
                                  if (tooltipItem.length == 0) return;
                                    tooltipItem = tooltipItem[0]
                                    var dataset =  data[currentInnings]["graphsData"]["teams"][tooltipItem.datasetIndex];
                                    var pointRadius = dataset["pointRadius"][tooltipItem.dataIndex];
                                    if (pointRadius == 0) return;
                                    
                                    let commentaryObject = dataset["wicketsCommentary"][tooltipItem.dataIndex]

                                    let str = commentaryObject["title"]
                                    return str
                                },
                                label: function (tooltipItem, Everything) {
                                  var dataset =  data[currentInnings]["graphsData"]["teams"][tooltipItem.datasetIndex];
                                  var pointRadius = dataset["pointRadius"][tooltipItem.dataIndex];
                                  if (pointRadius == 0) return;
                                  
                                  let commentaryObject = dataset["wicketsCommentary"][tooltipItem.dataIndex]

                                  let str = commentaryObject["commentary"]
                                  return str
                                },
                                footer: function (tooltipItem, Everything) {
                                  if (tooltipItem.length == 0) return;
                                  tooltipItem = tooltipItem[0]
                                  var dataset =  data[currentInnings]["graphsData"]["teams"][tooltipItem.datasetIndex];
                                  var pointRadius = dataset["pointRadius"][tooltipItem.dataIndex];
                                  if (pointRadius == 0) return;
                                  
                                  let commentaryObject = dataset["wicketsCommentary"][tooltipItem.dataIndex]

                                  let str = RunRateStringMaker(commentaryObject["runRates"])
                                  return str
                                },
                            },

                            filter: function (tooltipItem, Everything) {
                              
                              var dataset =  data[currentInnings]["graphsData"]["teams"][tooltipItem.datasetIndex];
                              var pointRadius = dataset["pointRadius"][tooltipItem.dataIndex];
                              if (pointRadius > 0) {
                                return true
                              } else {
                                return false
                              }
                            }
                        }
                      },
                    }}
                  }
                }
              />
            </div>
          </div>
        </div>
      </div>

          
      <div className="col-lg-12">
        <div className="iq-card iq-card-block iq-card-stretch">
          <div className="iq-card-body">
            <div className="d-flex w-100 justify-content-between">
              <div className="scorecard-innings-head-text">
                Worm
              </div>
              <div className="stat-graph-highlight-container">
                {
                  Object.keys(match.teams).map((teamName, index)=>(
                    <span className="" key={FindTeamLongName(match.teams[teamName])}>
                      <i
                        className={`fa fa-circle mr-2 stat-run-indicator stat-graph-highlight-sub-container`}
                        style={{color: FindTeamColor(match.teams[teamName])}}
                      ></i>
                      {FindTeamLongName(match.teams[teamName])}
                    </span>
                  ))
                }
              </div>
            </div>
            <div className="chart-container mt-3">
            <ChartComponent
              key={currentInnings+"-"+2}
                id={"statsWorm"}
                settings={
                  {
                    type: "line",
                    data: {
                      labels: data[currentInnings]["graphsData"]["labels"],
                      datasets: data[currentInnings]["graphsData"]["teams"].map((data, index) => {
                        let teamColor = FindTeamColor(match.teams[FindTeamLongName(data.team)])
                        teamColor = teamColor == "" ? match.defaultColors[index] : teamColor
                        return {
                          data: data.worm,
                          pointRadius: data.pointRadius,
                          tension: 0.2,
                          fill: false,
                          label: FindTeamLongName(data.team),
                          
                          // borderWidth: 2,
                          borderColor: [teamColor],
                          // hoverBorderColor: [tinycolor(teamColor).lighten(20).toHexString()],
                          backgroundColor: tinycolor(teamColor).lighten(100).toHexString(),
                          // hoverBorderCapStyle: "butt",
                          pointHoverBackgroundColor: tinycolor(teamColor).lighten(30).toHexString(),
                          pointHoverBorderColor: teamColor,
                        };
                      }),
                    },
                    options: {...WormGraphOptions, ...{
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                            displayColors: false,
                            display: true,
                            position: "nearest",
                            
                            callbacks: {
                                title: function (tooltipItem, Everything) {
                                  if (tooltipItem.length == 0) return;
                                    tooltipItem = tooltipItem[0]
                                    var dataset =  data[currentInnings]["graphsData"]["teams"][tooltipItem.datasetIndex];
                                    var pointRadius = dataset["pointRadius"][tooltipItem.dataIndex];
                                    if (pointRadius == 0) return;
                                    
                                    let commentaryObject = dataset["wicketsCommentary"][tooltipItem.dataIndex]

                                    let str = commentaryObject["title"]
                                    return str
                                },
                                label: function (tooltipItem, Everything) {
                                  var dataset =  data[currentInnings]["graphsData"]["teams"][tooltipItem.datasetIndex];
                                  var pointRadius = dataset["pointRadius"][tooltipItem.dataIndex];
                                  if (pointRadius == 0) return;
                                  
                                  let commentaryObject = dataset["wicketsCommentary"][tooltipItem.dataIndex]

                                  let str = commentaryObject["commentary"]
                                  return str
                                },
                                footer: function (tooltipItem, Everything) {
                                  if (tooltipItem.length == 0) return;
                                  tooltipItem = tooltipItem[0]
                                  var dataset =  data[currentInnings]["graphsData"]["teams"][tooltipItem.datasetIndex];
                                  var pointRadius = dataset["pointRadius"][tooltipItem.dataIndex];
                                  if (pointRadius == 0) return;
                                  
                                  let commentaryObject = dataset["wicketsCommentary"][tooltipItem.dataIndex]

                                  let str = RunRateStringMaker(commentaryObject["runRates"])
                                  return str
                                },
                            },

                            filter: function (tooltipItem, Everything) {
                              
                              var dataset =  data[currentInnings]["graphsData"]["teams"][tooltipItem.datasetIndex];
                              var pointRadius = dataset["pointRadius"][tooltipItem.dataIndex];
                              if (pointRadius > 0) {
                                return true
                              } else {
                                return false
                              }
                            }
                        }
                      },
                    }}
                  }
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


function IntraPlayerPartnershipRowComponent({partnersObject, teamColor, colClass}) {
  let partnersName = Object.keys(partnersObject)
  let partnerOneName = partnersName[0], partnerTwoName = partnersName[1]
  let partnerOneRuns = partnersObject[partnerOneName].runs, partnerTwoRuns = partnersObject[partnerTwoName].runs
  let partnerOneBalls = partnersObject[partnerOneName].balls, partnerTwoBalls = partnersObject[partnerTwoName].balls
  let totalPartnerRuns  = partnerOneRuns+partnerTwoRuns
  let totalPartnerBalls  = partnerOneBalls+partnerTwoBalls
  
  let playerOnePercentage = totalPartnerRuns > 0 ? partnerOneRuns / totalPartnerRuns * 100 : 0
  let playerTwoPercentage = totalPartnerRuns > 0 ? partnerTwoRuns / totalPartnerRuns * 100 : 0
  
  return (
    <div className={colClass}>
      <div className="d-flex flex-column part-container">
        <div className="d-flex justify-content-between align-items-center w-100">
          <span className="part-player-name w-100">{partnerOneName}</span>
          <span className="part-total-container w-100">{totalPartnerRuns}({totalPartnerBalls})</span>
          <span className="part-player-name w-100">{partnerTwoName}</span>
        </div>
        <div className="d-flex justify-content-between align-items-center w-100">
          <span className="part-player-runs w-10 mr-2">{partnerOneRuns}({partnerOneBalls})</span>
          <span className="d-flex justify-content-center part-bar-container w-100">
            <span
              className="part-bar"
              style={{ backgroundColor: teamColor, width: `${totalPartnerRuns > 100 ? playerOnePercentage : partnerOneRuns }%` }}
            ></span>
            <span
              className="part-bar"
              style={{ backgroundColor: tinycolor(teamColor).lighten(20).toHexString(), width: `${totalPartnerRuns > 100 ? playerTwoPercentage : partnerTwoRuns }%` }}
            ></span>
          </span>
          <span className="part-player-runs w-10 ml-2">{partnerTwoRuns}({partnerTwoBalls})</span>
        </div>
      </div>
    </div>
  );
}

function PartnershipComponent({partnershipData, teamMap}) {
  // partnershipData  = {}
  let colClass = "col-lg-12"
  return (
    <>
      {partnershipData.map((teamPartnersData, index) => (
        <div className="col-sm-6" key={"Partnerships-" + FindTeamLongName(teamPartnersData.team)}>
          <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
            <div className="iq-card-body">
              <div className="text-dark d-flex align-items-center part-team-container">
                <img
                  src={FindTeamImage(teamPartnersData.team)}
                  className="iq-card-icon avatar-30 mr-2"
                />
                {FindTeamLongName(teamPartnersData.team)}
              </div>
              <div className="row mt-3" style={{gap: ".8rem"}}>
                {/* <div className="col-lg-12">
                  <div className="d-flex flex-column part-container">
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <span className="part-player-name w-100">Babar Azam</span>
                      <span className="part-total-container w-100">
                        100(40)
                      </span>
                      <span className="part-player-name w-100">Babar Azam</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <span className="part-player-runs w-100">50(20)</span>
                      <span className="d-flex justify-content-center part-bar-container w-100">
                        <span
                          className="part-bar"
                          style={{ backgroundColor: "lightblue", width: "30%" }}
                        ></span>
                        <span
                          className="part-bar"
                          style={{
                            backgroundColor: "lightgreen",
                            width: "50%",
                          }}
                        ></span>
                      </span>
                      <span className="part-player-runs w-100">50(20)</span>
                    </div>
                  </div>
                </div> */}
                {
                  Object.keys(teamPartnersData.partners).map((partnerSlug, index)=>(
                    <IntraPlayerPartnershipRowComponent
                      key={FindTeamLongName(teamPartnersData.team)+"-"+partnerSlug}
                      partnersObject={teamPartnersData.partners[partnerSlug]}
                      teamColor={teamMap[FindTeamLongName(teamPartnersData.team)].color}
                      colClass={colClass}
                    />
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

function StatRunsIndicatorComponent({keyName, count, colClass, type }) {
  
  let run_color_map = {
    "1s": "info",
    "2s": "warning",
    "3s": "primary",
    "4s": "danger",
    "5s": "dark",
    "6s": "success",
  };
  let bowler_stat_map = {
    "runs": batAndBall,
    "wickets": bowled,
    "overs": balls,
    "balls": balls,
    "noballs": balls,
    "wides": balls,
    "maidens": balls,
    "dots": balls
  }
  
  return (
    <div className={`${colClass} stat-runs-separator`}>
      {
        type != "bowler stats" ? (
          <i className={`fa fa-circle text-${run_color_map[keyName]} mr-2 stat-run-indicator`}></i>
        ):
        (
          <img src={bowler_stat_map[keyName]} alt="" className="stat-bowler-indicator mr-2" />
        )
      }
      {keyName} x {count}
    </div>
  );
}

function BowlerPerformanceComponent({statsData, playerMap}) {
  let colClass = "col-xs-4 p-1"
  
  let team = statsData["team"]
  let teamName = FindTeamLongName(team)
  let player = playerMap[teamName][statsData["player"]].player
  let playerName = FindPlayerName(player)

  let headStats = {
    "runs": statsData["runs"],
    "wickets": statsData["wickets"],
    "economy": statsData["economy"],
    "overs": statsData["overs"],
  }

  let bowlingStats = {
    "runs": statsData["runs"],
    "wickets": statsData["wickets"],
    "overs": statsData["overs"],
    "balls": statsData["balls"],
    "maidens": statsData["maidens"],
    "noballs": statsData["noballs"],
    "wides": statsData["wides"],
    "dots": statsData["0s"],
  }

  let runStats = {
    "1s": statsData["1s"],
    "2s": statsData["2s"],
    "3s": statsData["3s"],
    "4s": statsData["4s"],
    "5s": statsData["5s"],
    "6s": statsData["6s"],
  }
  return (
    <div className="col-sm-6">
      <div className="iq-card iq-card-block iq-card-stretch">
        <div className="iq-card-body">
          <div className="stat-container d-flex justify-content-between flex-column">
            <div className="d-flex justify-content-start align-items-center stat-player">
              <img
                src={FindPlayerFaceImage(player)}
                alt=""
                className="avatar-70 stat-player-image"
              />
              <div className="d-flex flex-column">
                <Link to={FindPlayerProfile(player)} className="stat-player-name text-anchor">{playerName}</Link>
                <div className="text-dark stat-player-stats">
                  {headStats["overs"]} Overs
                  <span className="text-muted ml-2">{headStats.runs} runs • {headStats.wickets} wickets • {headStats.economy} economy</span>
                </div>
                {/* <div className="d-flex justify-content-start align-items-center stat-against-container">
                  vs
                  <select className="form-select form-control form-control-sm rounded h-40">
                    <option value="ALL">ALL</option>
                  </select>
                </div> */}
              </div>
            </div>
            <div className="stat-display-container pt-3">
              <div className="stat-sub-heading p-1">Stats Related to Bowler</div>
              <div className="row no-gutters" style={{columnGap: ".7rem"}}>
                {
                  Object.keys(bowlingStats).map((statName, index)=>(
                    <StatRunsIndicatorComponent key={playerName + "-"+statName} keyName={statName} count={bowlingStats[statName]} colClass={colClass} type={"bowler stats"} />
                  ))
                }
                {/* <StatRunsIndicatorComponent keyName={"wickets"} count={5} colClass={colClass} type={"bowler stats"} />
                <StatRunsIndicatorComponent keyName={"overs"} count={10} colClass={colClass} type={"bowler stats"} />
                <StatRunsIndicatorComponent keyName={"maidens"} count={2} colClass={colClass} type={"bowler stats"} />
                <StatRunsIndicatorComponent keyName={"noballs"} count={0} colClass={colClass} type={"bowler stats"} />
                <StatRunsIndicatorComponent keyName={"wides"} count={1} colClass={colClass} type={"bowler stats"} /> */}
              </div>
            </div>
            <div className="stat-display-container pt-3">
              <div className="stat-sub-heading p-1">Runs Conceded By Bowler</div>
              <div className="row no-gutters" style={{columnGap: ".7rem"}}>
                {
                  Object.keys(runStats).map((statName, index)=>(
                    <StatRunsIndicatorComponent key={playerName + "-"+statName} keyName={statName} count={runStats[statName]} colClass={colClass} />
                  ))
                }
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}


function BatterPerformanceComponent({statsData, playerMap}) {
  let colClass = "col-xs-4 p-1"
  let team = statsData["team"], against = statsData["against"]
  let teamName = FindTeamLongName(team)
  let player = playerMap[teamName][statsData["player"]].player
  let playerName = FindPlayerName(player)
  let headStats = {
    "fours": against["All"]["4s"],
    "sixes": against["All"]["6s"],
    "S/R": statsData["strikeRate"],
  }

  const [currentAgainst, setAgainst] = React.useState("All")

  
  let againstStats = {
    "1s": against[currentAgainst]["1s"],
    "2s": against[currentAgainst]["2s"],
    "3s": against[currentAgainst]["3s"],
    "4s": against[currentAgainst]["4s"],
    "5s": against[currentAgainst]["5s"],
    "6s": against[currentAgainst]["6s"],
  }
  return (
    <div className="col-sm-6">
      <div className="iq-card iq-card-block iq-card-stretch">
        <div className="iq-card-body">
          <div className="stat-container d-flex justify-content-between flex-column">
            <div className="d-flex justify-content-start align-items-center stat-player">
              <img
                src={FindPlayerFaceImage(player)}
                alt=""
                className="avatar-70 stat-player-image"
              />
              <div className="d-flex flex-column">
                <Link to={FindPlayerProfile(player)} className="stat-player-name text-anchor">{playerName}</Link>
                <div className="text-dark stat-player-stats">
                  {statsData["runs"]}({statsData["balls"]})
                  <span className="text-muted ml-2">{headStats["fours"]} fours • {headStats["sixes"]} sixes • {headStats["S/R"]} S/R</span>
                </div>
                <div className="d-flex justify-content-start align-items-center stat-against-container">
                  vs
                  <select className="form-select form-control form-control-sm rounded h-40" value={currentAgainst} onChange={(e)=>setAgainst(e.target.value)}>
                    {
                      Object.keys(against).map((value, index)=>(
                        <option key={player+"-"+value} value={value} selected={true}>{value}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
            </div>
            <div className="stat-display-container pt-3">
              <div className="stat-sub-heading p-1">Runs Scored By Batsman <span className="text-muted ml-2">{against[currentAgainst]["runs"]}({against[currentAgainst]["balls"]})</span></div>
              <div className="row no-gutters" style={{columnGap: ".7rem"}}>
                {
                  Object.keys(againstStats).map((runName, index)=>(
                    <StatRunsIndicatorComponent key={playerName + "-"+runName} keyName={runName} count={againstStats[runName]} colClass={colClass} />
                  ))
                }
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsTab