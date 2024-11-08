import axios from "axios";
import React from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import ChartComponent from "src/charts/ChartComponent";
import { BasicSettingsFunction, GLOBAL_FONT, ScaleFunction, tooltipFooterColor } from "src/charts/graphSettings";
import LongLoader from "src/components/Layouts/LongLoader";
import { FindMatchLink, FindPlayerFaceImage, FindPlayerName, FindPlayerProfile, FindTeamColor, FindTeamImage, FindTeamLongName } from "src/utils/utils";
import tinycolor from "tinycolor2";


let doughnut_dummy_data = {
  labels: ["Matches", "Drawn", "Tied", "No Result"],
  data: [18, 1, 2, 5],
  backgroundColors : ["lightgreen", "lightblue", "lightyellow", "lightgray"]
}


let pie_dummy_data = {
  labels: ["Pakistan Won", "New Zealand Won"],
  data: [18, 10],
  backgroundColors : ["lightgreen", "lightgray"]
}



function ReportTab({match}) {
  // going to use to update progress bar percentage
  const [progress, setProgress] = useOutletContext();

  const { series_slug, match_slug } = useParams();

  const [data, setData] = React.useState(null);

  // performing network request to server
  React.useEffect(() => {
    // setting progress bar to 60 percentage
    setProgress(60);
    // making a network request to server to fetch data
    
    axios.get(
      `http://127.0.0.1:8000/api/series/${series_slug}/${match_slug}/report`,
      {
        method: "GET",
      }
    )
      .then((response) => {
        let data= response.data.data
        setData(data);
        setProgress(100);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [match]);

  if (data == null || data == undefined) {
    return (
      <div className="col-lg-12">
        <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
          <div className="iq-card-body">
            <div className="row">
              <div className="col-lg-12">
                <div className="d-flex w-100 justify-content-center p-2">
                  <LongLoader />
                </div>
              </div>
              <div className="col-lg-12">
                <TypeAnimation
                  sequence={[
                    "Generating Match Predictor Report....",
                    500,
                    "Sit tight, Crunching numbers and analyzing past matches...",
                    500,
                    "Delving into player statistics...",
                    500,
                    "Thanks for your patience!",
                    500,
                  ]}
                  style={{ fontSize: "1.25rem", color: "var(--gray)", display: "flex", justifyContent: "center" }}
                  repeat={Infinity}
                />
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

  let teamComparisonData = data["teamComparisonStages"]
  let playerPerformanceData = data["playersPerformanceMetrics"]
  // console.log("Data: ", data)

  return (
    <>
      <WinnerSectionComponent
        teamMap={match.teams}
        outcomeObject={data.outcome} 
        format={match.format}
      />

      { Object.keys(teamComparisonData).length > 0 &&  (
          <div className="col-lg-12">
            <div className="iq-card iq-card-block iq-card-stretch">
              <div className="iq-card-body pt-2 pb-2">
                <div className="text-center scorecard-innings-head-text w-100">
                  TEAMS ANALYSIS
                </div>
              </div>
            </div>
          </div>
        )
      }
      {
        Object.keys(teamComparisonData).map((value, index)=>(
          <>
          <CategoryNameHeading name={value} />
          {
            teamComparisonData[value].map((statItem, statIndex)=>(
              <TeamComparisonStatComponent
                key={match.slug+statItem._id + value} 
                statObject={statItem} 
                teamMap={match.teams}
                teamNameMap={match.teamNameMap}
                typeName={statItem._id != value ? statItem._id : undefined}
                />
            ))
          }
          </>
        ))
      }


      {
        Object.keys(playerPerformanceData).length > 0 && (
          <div className="col-lg-12">
            <div className="iq-card iq-card-block iq-card-stretch">
              <div className="iq-card-body pt-2 pb-2">
                <div className="text-center scorecard-innings-head-text w-100">
                  PLAYERS ANALYSIS
                </div>
              </div>
            </div>
          </div>
        )
      }

      {
        Object.keys(playerPerformanceData).map((value, index)=>(
          <>
          <PlayersAnalysisComponent 
          key={match.slug+value}
          teamName={value}
          teamMap={match.teams}
          playersObject={playerPerformanceData[value]}
          />
          </>
        ))
      }

    </>
  );
}


function PlayerStatsTable({categoryName, rowObject}) {
  let player_column_map = {
    matches: "Mat.",
    innings: "Inns.",
    runs: "Runs",
    average: "Avg.",
    strikeRate: "S/R",
    wickets: "Wkts.",
    economy: "Econ.",
    bestBowlingFigure: "BBI"
  }
  
  return (
    <>
      <div className="report-player-table-subheading">{categoryName}</div>
      <div className="table-responsive report-player-table mt-2">
        <table className="table">
          <thead>
            <tr>
              {
                Object.keys(rowObject).map((key, index)=>(
                  <th key={categoryName+key}>{player_column_map[key]}</th>
                ))
              }
            </tr>
          </thead>
          <tbody>
            <tr>
              {
                Object.keys(rowObject).map((key, index)=>(
                  <td key={categoryName+index}>{typeof(rowObject[key]) == "number" ? rowObject[key].toFixed(2).replace(".00", "") : rowObject[key]}</td>
                ))
              }
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

function PlayerDataComponent({playerName, playerObject}) {
  let playerRole = playerObject["playerRole"]
  let player = playerObject["player"]
  let expectedRuns = Math.ceil(playerObject["expectedRuns"]);
  let runsPerWicketAverage = Math.round(playerObject["runsPerWicketAverage"], 2)
  let stats = playerObject["stats"]
  let [show, setShow] = React.useState(false)

  return (
    <div className="report-player-container">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex justify-content-start align-items-center">
          <Link
            to={FindPlayerProfile(player)}
            className={`d-flex align-items-center text-anchor report-player-header`}
          >
            <img
              src={FindPlayerFaceImage(player)}
              className="iq-card-icon avatar-45 mr-2"
            />
            {FindPlayerName(player)} 
            {
              playerRole != null && (
                <span className="text-muted ml-1">
                  {["C", "WK"].includes(playerRole.toUpperCase()) && "("+playerRole+")"}
                </span>
              )
            }
          </Link>
          <span className="text-muted ml-3 report-player-header-stats">(ER: {expectedRuns}, RWA: {runsPerWicketAverage})</span>
        </div>
        
        <button className="btn iq-waves-effect p-0" onClick={()=>setShow(!show)}>
          <i className={`ri-arrow-drop-${show ? "up" : "down"}-line text-muted h3 m-0`}></i>
        </button>
      </div>
      {
        show && (
          <div className={`d-flex justify-content-between flex-column overflow-hidden report-player-table-${show ? "show" : "hide"} p-2`}>
            {
              Object.keys(stats).map((role, index)=>(
                <>
                  <div className="report-player-table-heading">{role.toUpperCase()} STATS</div>
                  {
                    Object.keys(stats[role]).map((rowName, index)=>(
                      <PlayerStatsTable key={role+rowName} categoryName={rowName} rowObject={stats[role][rowName]} />
                    ))
                  }
                </>
              ))
            }
          </div>
         )
      } 
    </div>
  );
}

function PlayersAnalysisComponent({teamMap, teamName, playersObject}) {
  
  let team = teamMap[teamName]
  let totalExpectedRuns = Math.ceil(playersObject["totalExpectedRuns"]); 
  let totalRunsPerWicketAverage = Math.round(playersObject["totalRunsPerWicketAverage"], 2)
  let players = playersObject["players"]
  let points = playersObject["points"]
  return (
    <div className="col-lg-6">
        <div className="iq-card iq-card-block iq-card-stretch">
          <div className="iq-card-body">
            <div className="row no-gutters">
              <div className="col-lg-12">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="report-outcome-container d-flex align-items-center justify-content-start w-100">
                    <img
                      src={FindTeamImage(team)}
                      alt=""
                      className="avatar-40 iq-card-icon mr-2"
                    />
                    <div className="small-report-team-name">{FindTeamLongName(team)} Players</div>
                    <small className="text-muted ml-2">(TER: {totalExpectedRuns}, TRWA: {totalRunsPerWicketAverage})</small>
                  </div>
                  <div className="align-items-center d-flex justify-content-end report-total-points-text">
                    <span className="report-badge badge-positive pl-2 pr-2">
                      {points}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-lg-12">
                <div className="report-players-container mt-4">
                  {
                    Object.keys(players).map((playerName, index)=>(
                      <PlayerDataComponent
                      key={teamName+playerName}
                      playerName={playerName}
                      playerObject={players[playerName]} 
                      />
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}


function TeamComparisonStatComponent({statObject, teamMap, teamNameMap, typeName})
{
  let teamOneName = statObject["teamOneName"], teamTwoName = statObject["teamTwoName"]
  let teamOne = teamMap[teamOneName], teamTwo = teamMap[teamTwoName]
  let teamsMetrics = statObject["metrics"]
  let headToHead = statObject["headToHeadMatchPerformances"], recentMatches = statObject["recentMatchPerformances"]
  let teamOneWinningPercentage = Math.round(statObject["teamOneWinningPercentage"])
  let teamTwoWinningPercentage = Math.round(statObject["teamTwoWinningPercentage"])
  
  
  let graphData = {
    labels: [teamOneName, teamTwoName],
    datasets: [
      {color: FindTeamColor(teamOne), percentage: (teamOneWinningPercentage)},
      {color: FindTeamColor(teamTwo), percentage: (teamTwoWinningPercentage)},
    ],
    tooltips: [
      {
        title: `${teamOneName} Win Percentage (${teamOneWinningPercentage}%)`,
        body: [
          `Matches Played: ${statObject["totalMatches"]}`,
          `Innings Played: ${statObject["inningsPlayedByTeamOne"]}`,
          `Matches Won: ${statObject["teamOneWon"]}`,
          `Runs: ${statObject["totalScoreByTeamOne"]}`,
          `Average: ${statObject["teamOneAverageScore"]}`,
        ],
        footer: [
          `Rating: ${teamsMetrics[0]}`
        ]
      },
      {
        title: `${teamTwoName} Win Percentage (${teamTwoWinningPercentage}%)`,
        body: [
          `Matches Played: ${statObject["totalMatches"]}`,
          `Innings Played: ${statObject["inningsPlayedByTeamTwo"]}`,
          `Matches Won: ${statObject["teamTwoWon"]}`,
          `Runs: ${statObject["totalScoreByTeamTwo"]}`,
          `Average: ${statObject["teamTwoAverageScore"]}`,
        ],
        footer: [
          `Rating: ${teamsMetrics[1]}`
        ]
      }
    ]
  }


  return (
    <div className="col-lg-12">
      <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
        <div className="iq-card-body">
          <div className="row no-gutters">
            {typeName && (
              <div className="col-lg-12 mb-3">
                <div className="report-category-heading">{typeName}</div>
              </div>
            )}

            <div className="col-lg-12">
              <div className="d-flex align-items-center justify-content-between report-winner-container">
                <div className="report-outcome-container d-flex align-items-center justify-content-start w-100">
                  <img
                    src={FindTeamImage(teamOne)}
                    alt=""
                    className="avatar-50 iq-card-icon mr-2"
                  />
                  <div className="big-report-team-name">
                    {FindTeamLongName(teamOne)}
                  </div>
                </div>
                <div className="align-items-center d-flex justify-content-end report-total-points-text">
                  <span className="report-badge badge-positive-winner pl-2 pr-2">
                    {teamsMetrics[0]} - {teamsMetrics[1]}
                  </span>
                </div>
                <div className="report-outcome-container align-items-center d-flex justify-content-end w-100">
                  <div className="big-report-team-name">
                    {FindTeamLongName(teamTwo)}
                  </div>

                  <img
                    src={FindTeamImage(teamTwo)}
                    alt=""
                    className="avatar-50 iq-card-icon ml-2"
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="report-category-subheading mt-4">
                Head To Head
              </div>
              <div className="report-rc-team-matches-container">
                {headToHead.map((match, index) => (
                  <MatchListComponent
                    key={"headtohead-" + match.slug}
                    teams={match.teams}
                    teamNameMap={match.teamNameMap}
                    match={match}
                  />
                ))}
              </div>
            </div>
            {
              (teamOneWinningPercentage + teamTwoWinningPercentage) > 0 && (
                <div className="col-lg-6">
                  <div className="report-category-subheading mt-4">
                    Winning Percentage
                  </div>
                  <div className="report-team-chart">
                    <ChartComponent
                      id={`${statObject._id}`}
                      settings={{
                        type: "doughnut",
                        data: {
                          labels: graphData.labels,
                          datasets: [
                            {
                              data: graphData.datasets.map(
                                (value) => value.percentage
                              ),
                              hoverOffset: 2,
                              backgroundColor: graphData.datasets.map((value) =>
                                tinycolor(value.color).darken(0).toHexString()
                              ),
                              // borderWidth: 0,
                              // hoverBorderColor:
                              hoverBackgroundColor: graphData.datasets.map(
                                (value) =>
                                  tinycolor(value.color).lighten(10).toHexString()
                              ),
                            },
                          ],
                        },
                        options: {
                          ...BasicSettingsFunction(),
                          ...{
                            plugins: {
                              legend: {
                                display: true,
                                // fullSize: true,
                                // // position: "right",
                                labels: {
                                  usePointStyle: true,
                                  padding: 20,
                                  textAlign: "left",
                                },
                              },
                              tooltip: {
                                displayColors: false,
                                display: true,
                                position: "nearest",

                                callbacks: {
                                  title: function (tooltipItem, Everything) {
                                    if (tooltipItem.length == 0) return;
                                    tooltipItem = tooltipItem[0];

                                    var tootipData =
                                      graphData.tooltips[tooltipItem.dataIndex];
                                    let str = tootipData.title;
                                    return str;
                                  },
                                  label: function (tooltipItem, Everything) {
                                    var tootipData =
                                      graphData.tooltips[tooltipItem.dataIndex];
                                    let str = tootipData.body;

                                    return str;
                                  },
                                  footer: function (tooltipItem, Everything) {
                                    if (tooltipItem.length == 0) return;
                                    tooltipItem = tooltipItem[0];

                                    var tootipData =
                                      graphData.tooltips[tooltipItem.dataIndex];
                                    let str = tootipData.footer;
                                    return str;
                                  },
                                },
                              },
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              )
            }
            
            {
              !!statObject["recentMatchPerformances"] && (
                  <div className="col-lg-12">
                  <div className="report-category-subheading mt-4">
                    Recent Matches Performance
                  </div>
                  <div className="row mt-2">
                    {Object.keys(recentMatches).map((teamName, index) => (
                      <div className="col-lg-6" key={"rc-" + teamName}>
                        <div className="report-rc-team-subheading">
                          {teamName} Recent Matches
                        </div>
                        <div className="report-rc-team-matches-container">
                          {recentMatches[teamName].map((match, index) => (
                            <MatchListComponent
                              key={"rcm-"+ statObject._id + match.slug}
                              teams={match.teams}
                              teamNameMap={match.teamNameMap}
                              statTeamName={teamName}
                              match={match}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }


          </div>
        </div>
      </div>
    </div>
  );

}

let status_name_map = {
  win: "W",
  lost: "L",
  draw: "D",
  tie: "T",
  "no result": "NR"
}
function MatchListComponent({teams, teamNameMap, match, statTeamName}) {
  
  let outcome = match.outcome
  let startDate = new Date(match.startDate), endDate = new Date(match.endDate)
  let detailList = [
    startDate.toLocaleString("en-US", {dateStyle: "long"}),
    match.title,
    `${match.teamOneName} vs ${match.teamTwoName}`,
    // match.seriesName
  ]
  return (
    <Link
        to={FindMatchLink(match.slug, match.series)}
        className="custom-card d-block report-rc-match-list-container mw-100 p-1 pt-2 pb-2"
      >
        <div className="d-flex align-items-center justify-content-between w-100">
          <div className="d-flex justify-content-">
            <span className="d-flex align-items-center">
              {
                statTeamName != undefined ? 
                  (
                    <>
                    {
                      teamNameMap[outcome.winner] == statTeamName ? (
                        <span className="report-rc-match-outcome-tag report-rc-match-outcome-tag-win">W</span>
                      ):(
                        <span className={`report-rc-match-outcome-tag report-rc-match-outcome-tag-${!!outcome.winner ? "lost" : "other"}`}>{!!outcome.winner ? "L" : status_name_map[outcome.result]}</span>
                      )
                    }
                    </>
                  ):(
                    <>
                    {
                      outcome.winner != undefined ? (
                        <img src={FindTeamImage(teams[teamNameMap[outcome.winner]])} className="avatar-" width={25} />
                      ):(
                        <span className={`report-rc-match-outcome-tag report-rc-match-outcome-tag-other`}>{status_name_map[outcome.result]}</span>
                      )
                    }
                    </>
                  )
              }
            </span>
            <span className="d-flex justify-content-center flex-column ml-3">
              <span className="report-rc-match-details">
                {/* 20 January, 2024, 1st test, Pakistan vs England */}
                {detailList.join(", ")}
              </span>
              <span className="report-rc-match-result-text">{match.statusText}</span>
            </span>
          </div>
          <i className="ri-link report-rc-redirect-arrow"></i>
        </div>
    </Link>
  )
}

function WinnerSectionComponent({teamMap, outcomeObject, format}) {

  let teamNames = Object.keys(outcomeObject)
  let teamResults = [outcomeObject[teamNames[0]], outcomeObject[teamNames[1]]]
  let winner = teamResults[0].points > teamResults[1].points ? teamNames[0] : teamResults[0].points == teamResults[1].points ? null: teamNames[1]
  return (
    <div className="col-lg-12">
        <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
          <div className="iq-card-body">
            <div className="row no-gutters">
              <div className="col-sm-12">
                {
                  winner == null ? (
                    <div className="d-flex justify-content-center report-winner-head">
                      50/50 Chances For Both Teams
                    </div>
                  ):(
                    <div className="d-flex justify-content-center report-winner-head">
                      <b className="mr-2">Winner</b> {winner}!
                    </div>
                  )
                }
                <div className="d-flex align-items-center justify-content-between report-winner-container">
                  <div className="report-outcome-container d-flex align-items-center justify-content-start w-100">
                    <span className="d-flex justify-content-end">
                      {
                        teamNames[0] == winner && (
                          <span className="ri-vip-crown-2-fill report-badge badge-winner"></span>
                        )
                      }
                      <img
                        src={FindTeamImage(teamMap[teamNames[0]])}
                        alt=""
                        className="report-winner-image avatar-70 iq-card-icon mr-2"
                      />
                    </span>
                    <div className="d-flex justify-content-start align-items-start flex-column">
                      <div className="report-winner-team-name">{FindTeamLongName(teamMap[teamNames[0]])}</div>
                      {
                        (teamResults[0].scorePredicted > 0 && format != "TEST") &&  (
                          <div className="text-muted report-winner-expected-score mt-1">
                            Score Expected: {teamResults[0].scorePredicted}
                          </div>
                        )
                      }
                    </div>
                  </div>
                  <div className="align-items-center d-flex justify-content-end report-total-points-text">
                    <span className="report-badge badge-positive-winner pl-2 pr-2">
                      {teamResults[0].points} - {teamResults[1].points}
                    </span>
                  </div>
                  <div className="report-outcome-container align-items-center d-flex justify-content-end w-100">
                    <div className="d-flex justify-content-end align-items-end flex-column">
                      <div className="report-winner-team-name">{FindTeamLongName(teamMap[teamNames[1]])}</div>
                      {
                        (teamResults[1].scorePredicted > 0 && format != "TEST") && (
                          <div className="text-muted report-winner-expected-score mt-1">
                            Score Expected: {teamResults[1].scorePredicted}
                          </div>
                        )
                      }
                    </div>
                    <span className="d-flex justify-content-start">
                      {
                        teamNames[1] == winner && (
                          <span className="ri-vip-crown-2-fill report-badge badge-winner"></span>
                        )
                      }
                      <img
                        src={FindTeamImage(teamMap[teamNames[1]])}
                        alt=""
                        className="report-winner-image avatar-70 iq-card-icon ml-2"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
  
}

function CategoryNameHeading({name}) {
  return (
    <div className="col-lg-12">
    <div className="iq-card iq-card-block iq-card-stretch">
      <div className="iq-card-body pt-2 pb-2">
        <div className="report-category-heading">{name}</div>
      </div>
    </div>
  </div>
  )
  
}
export default ReportTab

function TableComponent(params) {
  return (
    <div className="table-responsive report-rc-table iq-card-border-radius mt-3">
      <table className="table mb-0 ">
        <thead>
          <tr className="table-row-bg">
            <th>Match</th>
            <th width="50%">Result</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <a href="" className="text-anchor">
                Scorecard#3523
              </a>
            </td>
            <td>Pakistan won by 78 runs</td>
            <td>23 January, 2024</td>
          </tr>
          <tr>
            <td>
              <a href="" className="text-anchor">
                Scorecard#3523
              </a>
            </td>
            <td>Pakistan won by 78 runs</td>
            <td>23 January, 2024</td>
          </tr>
          <tr>
            <td>
              <a href="" className="text-anchor">
                Scorecard#3523
              </a>
            </td>
            <td>Pakistan won by 78 runs</td>
            <td>23 January, 2024</td>
          </tr>
          <tr>
            <td>
              <a href="" className="text-anchor">
                Scorecard#3523
              </a>
            </td>
            <td>Pakistan won by 78 runs</td>
            <td>23 January, 2024</td>
          </tr>
          <tr>
            <td>
              <a href="" className="text-anchor">
                Scorecard#3523
              </a>
            </td>
            <td>Pakistan won by 78 runs</td>
            <td>23 January, 2024</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}