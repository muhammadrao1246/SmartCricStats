import React from "react";
import axios from "axios";
import { Link, useOutletContext } from "react-router-dom";
import TableMaker from "src/components/Layouts/TableMaker";


import teamPlaceholder from "src/assets/images/team_placeholder.svg";
import playerPlaceholder from "src/assets/images/player_placeholder.svg";
import { ROUTES } from "src/routes/urls";
import { FindGroundLongName, FindGroundProfile, FindMatchLink, FindSeriesLongName, FindSeriesProfile } from "src/utils/utils";
import DataNotFoundMessage from "src/components/Layouts/DataNotFoundMessage";
import LoadingSpinnerComponent from "src/components/Layouts/LoadingSpinnerComponent";


let sections = [
  "First/Last Matches by Format",
  "Recent Matches in Each Format"
]

let columnsMap = {
  "TEST" : "Test Matches",
  "ODI": "ODI Matches",
  "T20": "T20 Matches"
}

function MatchesTab({ ground }) {

  // going to use to update progress bar percentage
  const [progress, setProgress] = useOutletContext();

  const [data, setData] = React.useState(null)


  // fetching player stats
  React.useEffect(()=>{
    // setting progress bar to 60 percentage
    setProgress(60)
    // making a network request to server to fetch stats data
      fetch(`http://127.0.0.1:8000/api/grounds/${ground.slug}/matches`, {
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
      
  }, [ground])


  let DEBUT_LAST_MATCHES = null
  let RECENT_MATCHES = null

  // if data is loading
  if (data == null) {
    DEBUT_LAST_MATCHES = 
    (<div className="col-lg-12">
      <LoadingSpinnerComponent />
    </div>);
  }
  // if no data returned against query 
  else if (Object.keys(data).length == 0) {
    DEBUT_LAST_MATCHES= 
    (
        <DataNotFoundMessage colClass={"col-lg-12"} message={"No Matches Found"} />
    );
  }
  // if provided data against the filters for player
  else{
    DEBUT_LAST_MATCHES = (
      <>
        {
          Object.keys(data[sections[0]]).length > 0  && (
            <div key={sections[0]} className="col-lg-12">
              <div className="iq-card iq-card-block iq-card-stretch iq-card-height p-0">
                <div className="iq-card-body p-0">
                  <div className="main-table-heading p-3">{sections[0]}</div>
                  <div className="table-responsive">
                  <table className="table mb-0 main-table">
                    {
                      Object.keys(data[sections[0]]).map((format, index)=>(
                        <>
                        <thead className='main-thead '>
                          <tr className="main-row-bg">
                            <th key={format} colSpan={2}>{columnsMap[format]}</th>
                          </tr>
                        </thead>
                        <tbody>
                        {
                          Object.keys(data[sections[0]][format]).map((matchSequence, index)=>(
                          <>
                          <tr>
                            <td style={{width: "20%"}}>{matchSequence}</td>
                            <td>
                            <MatchLink
                                      key={data[sections[0]][format][matchSequence].slug}
                                      slug={data[sections[0]][format][matchSequence].slug}
                                      series={data[sections[0]][format][matchSequence].series}
                                      teamOne={data[sections[0]][format][matchSequence].teamOneName}
                                      teamTwo={data[sections[0]][format][matchSequence].teamTwoName}
                                      ground={data[sections[0]][format][matchSequence].ground}
                                      groundName={data[sections[0]][format][matchSequence].groundName}
                                      startDateString={data[sections[0]][format][matchSequence].startDateString}
                                      linkClass={"text-anchor"}
                                    />
                            </td>
                          </tr>
                          </>
                          ))
                        }
                        </tbody>
                        </>
                    ))
                  }
                  </table>
                      
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </>
    )
    RECENT_MATCHES = (
      <>
        {
          Object.keys(data[sections[1]]).length > 0 && (
            <div key={sections[1]} className="col-lg-12">
              <div className="iq-card iq-card-block iq-card-stretch iq-card-height p-0">
                <div className="iq-card-body p-0">
                  <div className="main-table-heading p-3">{sections[1]}</div>
                  <div className="table-responsive">
                  <table className="table mb-0 main-table">
                    {
                      Object.keys(data[sections[1]]).map((format, index)=>(
                        <>
                        <thead className='main-thead '>
                          <tr className="main-row-bg">
                            <th key={format} colSpan={4}>{columnsMap[format]}</th>
                          </tr>
                          <tr>
                            <th>Match</th>
                            <th>Date</th>
                            <th>Series</th>
                            <th>Outcome</th>
                          </tr>
                        </thead>
                        <tbody>
                        {
                          data[sections[1]][format].map((match, index)=>(
                          <>
                          <tr>
                            <td style={{width: "20%"}}>
                            <MatchLink
                                      key={match.slug}
                                      slug={match.slug}
                                      series={match.series}
                                      teamOne={match.teamOneName}
                                      teamTwo={match.teamTwoName}
                                      seriesName={null}
                                      ground={null}
                                      groundName={null}
                                      startDateString={null}
                                      linkClass={"text-anchor"}
                                    />
                            </td>
                            <td>
                              {match.startDateString}
                            </td>
                            <td>
                              <SeriesLink 
                                series={match.series}
                                linkClass={"text-anchor"}
                              />
                            </td>
                            <td>
                              {match.statusText}
                            </td>
                          </tr>
                          </>
                          ))
                        }
                        </tbody>
                        </>
                    ))
                  }
                  </table>
                      
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </>
    )
    
  }
  
  // console.log(DEBUT_LAST_MATCHES, RECENT_MATCHES)
  //  if some data provided then print all
  return (
    <div className="row">
      {DEBUT_LAST_MATCHES}
      {RECENT_MATCHES}
      {
        data != null && (
          <>
          {(Object.keys(data[sections[0]]).length == 0 && Object.keys(data[sections[1]]).length == 0)  && (
            <DataNotFoundMessage colClass={"col-lg-12"} message={"No Matches Found"} />
          )}
          </>
        )
      }
    </div>
  );
}

function GroundLink({ground, linkClass}) {
  return <Link to={FindGroundProfile(ground)} className={linkClass}>
  {
    (FindGroundLongName(ground))
  }
</Link>
}

function SeriesLink({series, linkClass}) {
  return <Link to={FindSeriesProfile(series)} className={linkClass}>
    {
      (FindSeriesLongName(series))
    }
  </Link>
}

function MatchLink({slug, title, series, teamOne, teamTwo, groundName, ground, startDateString, linkClass}) {
  return <Link to={FindMatchLink(slug, series)} className={linkClass}>
    {
      (teamOne + " vs " + teamTwo) + (ground == null ? groundName != null ? (" at " + groundName) : ""  : " at " + ground.shortName) + (startDateString == null ? "" :  " - " + startDateString)
    }
  </Link>
}


export default MatchesTab;
