import React from 'react'
import { Link, useOutletContext, useParams } from "react-router-dom";


import { FindPlayerFaceImage, FindPlayerName, FindPlayerProfile } from 'src/utils/utils';

function ScoreCardTab({match}) {

  // going to use to update progress bar percentage
  const [progress, setProgress] = useOutletContext();

  const {series_slug, match_slug} = useParams()

  const [data, setData] = React.useState(null)


  // fetching player stats
  React.useEffect(()=>{
    // setting progress bar to 60 percentage
    setProgress(60)
    // making a network request to server to fetch stats data
      fetch(`http://127.0.0.1:8000/api/series/${series_slug}/${match_slug}/scorecard`, {
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
        {
            data.scorecard.map((scorecard, index)=>(
                <>
                {
                    (!scorecard.isSuperOver && !scorecard.isForfeited) && (
                        <ScoreCardTableCreator
                            key={"innings-table-"+index}
                            scorecard={scorecard}
                            fallOfWickets={data.fallOfWickets[index]}
                            teamIdMap={match.idToTeam}
                            playerMap={match.players}
                        />
                    )
                }
                </>
            ))
        }
    </>
  )
}


function ExtrasRow({legbyes, byes, wides, penalty, noballs}){
    
    let extraList = []
    if (legbyes > 0) extraList.push(legbyes+" lb")
    if (byes > 0) extraList.push(byes+" b")
    if (noballs > 0) extraList.push(noballs+" nb")
    if (wides > 0) extraList.push(wides+" wd")
    if (penalty > 0) extraList.push(penalty+" epn")
    
    return (
      <tr>
        <td>Extras</td>
        <td className='text-muted'>{extraList.length > 0 && "("+extraList.join(", ")+")" }</td>
        <td colSpan={10}>
          <b>{legbyes + byes + wides + penalty + noballs}</b>
        </td>
      </tr>
    );
}

function TotalRow({runs, balls, overs, wickets})
{
    let runRate = runs/overs
    return (
      <tr className="table-row-bg text-dark">
        <td>
          <b>TOTAL</b>
        </td>
        <td>{overs} Ov, {runRate} RR</td>
        <td colSpan={10}>
          <b>{runs}{wickets < 10 && "/"+wickets}</b>
        </td>
      </tr>
    );
}
/*  
"hit the ball twice"
1
"handled the ball"
2
"run out"
3
"retired hurt"
4
"hit wicket"
5
"caught and bowled"
6
"lbw"
7
"retired out"
8
"caught"
9
"stumped"
10
"bowled"
11
"obstructing the field"
12
"retired not out"
13
"timed out" 
*/
function ScoreCardBatterRow({player, stat}){
    // console.log(player)
    // // return <>   </>
    let playerName = FindPlayerName(player["player"])
    let wicketText = ()=>{
        let temp = ""
        if (stat.wicket == null) temp = "not out"
        else if(stat.wicket.kind == "caught and bowled") temp = "c & b" + " " + stat.wicket.bowler
        else if(stat.wicket.kind == "bowled") temp = "b " + stat.wicket.bowler
        else if(stat.wicket.kind == "lbw") temp = "lbw " + stat.wicket.bowler
        else if(stat.wicket.kind == "caught") temp = "c " + stat.wicket.fielders.map(value=>value.name).join(", ") + " b " + stat.wicket.bowler
        else if(stat.wicket.kind == "run out") temp = "run out (" + stat.wicket.fielders.map(value=>value.name).join(", ") + ")"
        else if(stat.wicket.kind == "stumped") temp = "st. " + stat.wicket.fielders.map(value=>value.name).join(", ") + " b " + stat.wicket.bowler
        
        return temp != "" ? temp : stat.wicket.kind 
    }
    return (
      <tr>
        <td width={"30%"} style={{ fontFamily: "sans-serif" }}>
          <Link
            to={FindPlayerProfile(player["player"])}
            className={`d-inline vertical-align-middle w-100 h-100 scorecard-table-player-name ${
              typeof player["player"] != "string" && "text-anchor"
            }`}
          >
            <img
              src={FindPlayerFaceImage(player["player"])}
              className="iq-card-icon avatar-50 mr-2"
            />
            {playerName}
            {/* <i
                                            style={{ fontSize: "8px" }}
                                            className="fa fa-circle text-success ml-2 mr-2
                                                    "
                                        ></i> */}
          </Link>
          {typeof player != "string" &&
            (player["playerRole"] == "C" || player["playerRole"] == "WK") && (
              <span className="text-muted ml-2">
                {"(" + player["playerRole"] + ")"}
              </span>
            )}
        </td>
        <td>
          <span className="text-muted">{wicketText()}</span>
        </td>
        <td>
          <b>{stat.runs}</b>
        </td>
        <td>{stat.balls}</td>
        <td>{stat["4s"]}</td>
        <td>{stat["6s"]}</td>
        <td>{stat["strikeRate"]}</td>
      </tr>
    );
}

function YetToBatRow({ yetToBat, playerMap}){
    console.log(playerMap)
    if (yetToBat.length == 0) {
        return <></>
    }
    return (
      <tr>
        <td colSpan={"100%"} className="fall_of_wickets">
          <b>Yet to bat: </b>{" "}
          {yetToBat.map((player, index)=>(
            <>
            <Link
            to={FindPlayerProfile(playerMap[player]["player"])}
            className={`${
                typeof playerMap[player]["player"] != "string" && "text-anchor"
            }`} 
            key={index}>
                {FindPlayerName(playerMap[player]["player"])}
            </Link>
            {index != yetToBat.length - 1 && " • "}
            </>
          ))}
        </td>
      </tr>
    );
}

function FallOfWicketsRow({fallOfWickets}){
    if (Object.keys(fallOfWickets.wickets).length == 0) {
        return <></>
    }
    let wicketsList = []
    for(let index = 0; index < fallOfWickets.wickets.length; index++){
        let wicket = fallOfWickets.wickets[index]
        let wicketNum = index+1
        wicketsList.push(`${wicket.runsAtTime}/${wicketNum} (${wicket.playerOut}, ${wicket.overAtTime} Ov)`)
    }
    return (
      <tr>
        <td colSpan={"100%"} className="fall_of_wickets">
          <b>Fall of wickets: </b>
          <span className="text-muted">
            {wicketsList.join(" • ")}
          </span>
        </td>
      </tr>
    );
}

function ScoreCardBowlingRow({player, stat}){
    // console.log(player)
    // // return <>   </>
    let playerName = FindPlayerName(player["player"])

    return (
      <tr>
        <td width={"60%"} className="">
          <Link
            to={FindPlayerProfile(player["player"])}
            className={`d-inline vertical-align-middle w-100 h-100 scorecard-table-player-name ${
                typeof player["player"] != "string" && "text-anchor"
              }`}
          >
            <img
              src={FindPlayerFaceImage(player["player"])}
              className="iq-card-icon avatar-50 mr-2"
            />
            {playerName}
            {/* <i
              style={{ fontSize: "8px" }}
              className="fa fa-circle text-success ml-2 mr-2
                                                "
            ></i> */}
          </Link>
        </td>
        <td>{stat.overs}</td>
        <td>{stat.maidens}</td>
        <td>{stat.runs}</td>
        <td>
          <b>{stat.wickets}</b>
        </td>
        <td>{stat.economy}</td>
        <td>{stat["0s"]}</td>
        <td>{stat["4s"]}</td>
        <td>{stat["6s"]}</td>
        <td>{stat.wides}</td>
        <td>{stat.noballs}</td>
      </tr>
    );
}




function ScoreCardTableCreator({teamIdMap, playerMap, scorecard, fallOfWickets}) {
    
    // console.log(playerMap)
    let batting_team = teamIdMap[scorecard.team]
    let bowling_team = null
    
    for (let team in teamIdMap){
        if( teamIdMap[team] != batting_team ){
            bowling_team = teamIdMap[team]
        }
    }
    // console.log(batting_team)
    // console.log(bowling_team)
    let BATTING_TEAM_NAME = typeof(batting_team) == "string" ? batting_team : batting_team.longName 
    let BOWLING_TEAM_NAME = typeof(bowling_team) == "string" ? bowling_team : bowling_team.longName

    return (
    <div className="col-lg-12">
        <div className="iq-card iq-card-block iq-card-stretch iq-card-height p-0">
          <div className="iq-card-body p-0">
            <div className="scorecard-innings-head-text p-3">
                {BATTING_TEAM_NAME} ({scorecard.inningNumber > 2 ? "2nd Innings" : "1st Innings"})
            </div>
            <div className="table-responsive">
                <table className="table mb-0 scorecard-table">
                    <thead>
                        <tr className='table-row-bg'>
                            <th colSpan={2}>BATTING</th>
                            <th>R</th>
                            <th>B</th>
                            <th>4s</th>
                            <th>6s</th>
                            <th>SR</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                    {
                            Object.keys(scorecard.BATTING).map((batter, index)=>(
                                <ScoreCardBatterRow key={index} team={BATTING_TEAM_NAME} player={playerMap[BATTING_TEAM_NAME][batter] == undefined ? batter : playerMap[BATTING_TEAM_NAME][batter]} stat={scorecard.BATTING[batter]}/>
                            ))
                        }
                        

                    </tbody>

                    <tfoot>
                        <ExtrasRow 
                            legbyes={scorecard.legbyes}
                            byes={scorecard.byes}
                            noballs={scorecard.noballs}
                            wides={scorecard.wides}
                            penalty={scorecard.penalty}
                            />
                        <TotalRow
                            runs={scorecard.totalRuns}
                            balls={scorecard.totalBalls}
                            overs={scorecard.totalOvers}
                            wickets={scorecard.totalWickets}
                        />
                        <YetToBatRow
                            yetToBat={scorecard.yetToBat}
                            playerMap={playerMap[BATTING_TEAM_NAME]} 
                        />
                        <FallOfWicketsRow
                            fallOfWickets={fallOfWickets} 
                        />
                    </tfoot>

                </table>
            </div>

            <div className="table-responsive">
                <table className="table mb-0 scorecard-table">
                    <thead>
                        <tr className='table-row-bg'>
                            <th>BOWLING</th>
                            <th>Ov</th>
                            <th>M</th>
                            <th>R</th>
                            <th>W</th>
                            <th>ECON</th>
                            <th>0s</th>
                            <th>4s</th>
                            <th>6s</th>
                            <th>WD</th>
                            <th>NB</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        {
                            Object.keys(scorecard.BOWLING).map((bowler, index)=>(
                                <ScoreCardBowlingRow key={index} player={playerMap[BOWLING_TEAM_NAME][bowler] == undefined ? bowler : playerMap[BOWLING_TEAM_NAME][bowler]} stat={scorecard.BOWLING[bowler]}/>
                            ))
                        }
                    </tbody>

                </table>
            </div>
            
          </div>
        </div>
      </div>
    )
}

export default ScoreCardTab