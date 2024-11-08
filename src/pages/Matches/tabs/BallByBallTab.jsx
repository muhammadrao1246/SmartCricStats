import axios from "axios";
import React from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { FindTeamLongName, RunRateStringMaker } from "src/utils/utils";

function BallByBallTab({ match }) {
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
      `http://127.0.0.1:8000/api/series/${series_slug}/${match_slug}/ballbyball`,
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


  let maxOversInning = {"overs": []}
  data[currentInnings].map((inning, index)=>{
    maxOversInning = inning["overs"].length >= maxOversInning["overs"].length ? inning : maxOversInning
  })
  // console.log(maxOversInning)

  return (
    <>
      <div className="col-lg-12">
        <div className="mb-3 d-flex justify-content-start inning-tab flex-wrap pl-3 pr-3" style={{ gap: "10px" }}>
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
      <div className="col-lg-12">
        <div className="iq-card iq-card-block iq-card-stretch iq-card-height p-0">
          <div className="iq-card-body p-0">
            {/* <div className="scorecard-innings-head-text p-3">
                Pakistan (1st Innings)
            </div> */}
            <div className="table-responsive iq-card-border-radius">
              <table className="table mb-0 ballbyball-table">
                <thead>
                  <tr className="table-row-bg">
                    <th width="1%">Overs</th>
                    {data[currentInnings].map((inning, index) => (
                      <th key={"team-"+index}>
                        {FindTeamLongName(inning["team"])}
                        <span className="text-muted ml-3">{inning["stats"]["runs"] + (inning["stats"]["wickets"] < 10 && "/"+inning["stats"]["wickets"])} <small>({inning["stats"]["overs"]} Overs)</small></span>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {maxOversInning["overs"].map((over, index) => (
                    <OverRow key={"OverRow-"+currentInnings+"-"+index} over={index} inningsArray={data[currentInnings]} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function OverRow({inningsArray, over}) {

  const [visibility, setVisibility] = React.useState("hide")
  
  return (
    <tr>
      <td width={""} className="">
        <div className="d-flex w-100 h-100 justify-content-center align-items-center">
          <span className="bbb-over table-row-bg">{over + 1}</span>
        </div>
      </td>
      {inningsArray.map((inning, index) => (
        <td width={"50%"} key={index}>
        {/* {console.log(inning["overs"][over])} */}
          <OverComponent 

            inningNumber={inning["inningNumber"]}
            overNumber={over+1}
            runRates={inning["overs"][over] != undefined ? inning["overs"][over]["runRates"] : null}
            inningStats={inning["overs"][over] != undefined ? inning["overs"][over]["inningStats"] : null}
            overStats={inning["overs"][over] != undefined ? inning["overs"][over]["overStats"] : null}
            ballsData={inning["overs"][over] != undefined ? inning["overs"][over]["deliveries"] : null}  
            impactClass={inning["overs"][over] != undefined ? inning["overs"][over]["impactClass"] : null}
            visibility={visibility}
            setVisibility={setVisibility}

            />
        </td>
      ))}

    </tr>
  );
}



function BallComponent({batter, nonStriker, bowler, runRates, cTitle, cDesc}) {


  return (
    <>
      <div className="bbb-bowler-info mt-3">
        <b>Batters: </b> {batter["name"]} &nbsp;&nbsp;{batter["runs"]}({batter["balls"]})
      </div>
      <div className="bbb-bowler-info">
        <b>Non Striker: </b> {nonStriker["name"]} &nbsp;&nbsp;{nonStriker["runs"]}({nonStriker["balls"]})
      </div>
      <div className="bbb-bowler-info">
        <b>Bowler: </b> {bowler["name"]} &nbsp;&nbsp;{bowler["overs"]} Ov ({bowler["runs"]}-{bowler["wickets"]})
      </div>
      <div className="bbb-commentary-container mt-2">
        <div className="bbb-commentary-head">
          {cTitle}
        </div>
        <div className="bbb-commentary-detail">
          {cDesc}
        </div>
      </div>
      <div className="bbb-overs-stats mt-3">
        {RunRateStringMaker(runRates)}
      </div>
    </>
  );
}

// css classes
let ball_class_map = {
  "boundary": "success",
  "wicket": "danger",
  "normal": "light"
}
function BallsTabComponent({inningNumber, overNumber, ballsData}) {

  const [currentBallIndex, setCurrentBall] = React.useState(0)

  console.log(ballsData)
  return (
    <>
      <div className="bbb-balls-container w-100">
        {ballsData.map((value, index) => (
          <button
            key={"tab-" + inningNumber + "-" + overNumber + "-" + index}
            onClick={() => setCurrentBall(index)}
            className={`btn iq-waves-effect p-0 ${currentBallIndex == index ? "ball-active" : ""}`}
          >
            <div
              className={`bbb-ball bg-${
                ball_class_map[ballsData[index]["class"]]
              }`}
            >
              {ballsData[index]["ball"]}
            </div>
          </button>
        ))}
      </div>
      <BallComponent
        key={"ball-" + inningNumber + "-" + overNumber + "-" + currentBallIndex}
        batter={ballsData[currentBallIndex]["batter"]}
        nonStriker={ballsData[currentBallIndex]["nonStriker"]}
        bowler={ballsData[currentBallIndex]["bowler"]}
        runRates={ballsData[currentBallIndex]["runRates"]}
        cTitle={ballsData[currentBallIndex]["commentaryTitle"]}
        cDesc={ballsData[currentBallIndex]["commentaryDescription"]}
      />
    </>
  );
}


function OverComponent({inningNumber, overNumber, impactClass, runRates, inningStats, overStats, ballsData, visibility, setVisibility}) {

  if (ballsData == null) {
    return <>&nbsp;</>
  }

  return (
    <div className={`bbb-over-container pt-1 pb-1 bbb-over-${impactClass != "" ? impactClass : ""}`}>
      <button className="btn iq-waves-effect bbb-over-row p-2 w-100" onClick={()=>setVisibility(visibility == "hide" ? "show" : "hide")}>
        <span className="bbb-match-info">{inningStats["runs"]}{inningStats["wickets"] < 10 && "/"+inningStats["wickets"]}</span>
        <span className="bbb-detail-match-info text-muted ml-2" title="this over stats">
          (runs: {overStats["runs"]}, wickets: {overStats["wickets"]})
        </span>
        <span className="bbb-overs-stats"></span>
      </button>
      <div className={`bbb-over-data p-2 ${visibility == "hide" && "d-none"}`}>
        <BallsTabComponent 
          ballsData={ballsData}
          inningNumber={inningNumber}
          overNumber={overNumber}
        />
        {
        /* <div className="bbb-bowler-info">
          <b>Batters: </b> {} (100) 88
        </div>
        <div className="bbb-bowler-info">
          <b>Non Striker: </b> Muhammad Amir (100) 88
        </div>
        <div className="bbb-bowler-info">
          <b>Bowler: </b> Muhammad Amir
        </div>
        <div className="bbb-balls-container mt-3 w-100">
          <button className="btn iq-waves-effect p-0">
            <div className="bbb-ball bg-light">•</div>
          </button>
          <button className="btn iq-waves-effect p-0">
            <div className="bbb-ball bg-success">4</div>
          </button>
          <button className="btn iq-waves-effect p-0">
            <div className="bbb-ball bg-danger">1w</div>
          </button>
          <button className="btn iq-waves-effect p-0">
            <div className="bbb-ball bg-success">6</div>
          </button>
          <button className="btn iq-waves-effect p-0">
            <div className="bbb-ball bg-light">1lb</div>
          </button>
          <button className="btn ball-active iq-waves-effect p-0">
            <div className="bbb-ball bg-light">1nb</div>
          </button>
        </div>
        <div className="bbb-commentary-container mt-2">
          <div className="bbb-commentary-head">
            Mohammad Amir to Babar Azam, 6 runs
          </div>
          <div className="bbb-commentary-detail">
            Babar Azam hit a beautiful six out of the park. Mohammad Amir
            getting angry!
          </div>
        </div>
        <div className="bbb-overs-stats mt-3">
          RR: 3.67 • RRR: 5.76 • CRR: 7.65
        </div> 
        */
        }
      </div>
    </div>
  );
}



export default BallByBallTab;
