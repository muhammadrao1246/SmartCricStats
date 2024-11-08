import React from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";

import teamPlaceholder from "src/assets/images/team_placeholder.svg";
import { ROUTES } from "src/routes/urls";


let columnsFromMatch = {
    "title" : "Title", 
    "matchStage": "Match Stage",
    "matchGroup": "Match Group",
    "matchNumber": "Match Number",
    "series": "Series",
    "season": "Season",
    "format": "Format",
    "ground": "Venue",
}
let alternateColumnForMatch = {
    "series": "seriesName",
    "ground": "groundName"
}


let columnFromResponse = {
    "tossText": "Toss",
    "outcomeText": "Outcome",
    "dayType": "Day Type",
    "floodlit": "Floodlit",
    "daysInfo": "Match Days",
    "debuts": "Debuts",
    "umpires": "Umpires",
    "tv_umpires": "TV Umpires",
    "reserve_umpires": "Reserve Umpires",
    "match_referees": "Match Referees"
}
function InfoTab({match}) {

  // going to use to update progress bar percentage
  const [progress, setProgress] = useOutletContext();

  const {series_slug, match_slug} = useParams()

  const [data, setData] = React.useState(null)


  // fetching player stats
  React.useEffect(()=>{
    // setting progress bar to 60 percentage
    setProgress(60)
    // making a network request to server to fetch stats data
      fetch(`http://127.0.0.1:8000/api/series/${series_slug}/${match_slug}/info`, {
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
    <div className="col-lg-12">
        <div className="iq-card iq-card-block iq-card-stretch iq-card-height p-0">
          <div className="iq-card-body p-0">
            <div className="info-match-detail-text p-3">
                Match Details
            </div>
            <div className="table-responsive">
                <table className="table mb-0 info-table">
                    <tbody>
                        {
                            Object.keys(columnsFromMatch).map((value, index)=>(
                                <>
                                {
                                    (match[value] != null || match[alternateColumnForMatch[value]] != undefined) && 
                                    <tr key={value}>
                                        <td>{columnsFromMatch[value]}</td>
                                        <td>
                                        {
                                            typeof(match[value]) == "object" && (
                                                <Link to={`/${value}/${match[value].slug}`}>
                                                    {match[value].longName}
                                                </Link>  
                                            )
                                        }
                                        {
                                            (typeof(match[value]) == "string" || typeof(match[value]) == "number") && (
                                                <>
                                                    {match[value]}
                                                </>
                                            )
                                        }
                                        {
                                            match[value] == null && (
                                                <>
                                                    {match[alternateColumnForMatch[value]]} 
                                                </>
                                            )
                                        }
                                        </td>
                                    </tr>
                                }
                                </>
                            ))
                        }
                        {
                            Object.keys(columnFromResponse).map((value, index)=>(
                                
                                <>
                                {
                                    data[value] != null && 
                                    <tr>
                                        <td>{columnFromResponse[value]}</td>
                                        {
                                            typeof(data[value]) == "object" && (
                                                <>
                                                {
                                                    value == "daysInfo" ? (
                                                        <td>
                                                            {
                                                                data[value].map((info, index)=>(
                                                                    <>
                                                                    {index % 2 != 0 ? " to ": ""}
                                                                    <b>{info}</b>
                                                                    </>
                                                                ))
                                                            }
                                                        </td>
                                                    )
                                                    :
                                                    (
                                                        <td className="p-0">
                                                            {
                                                                data[value].map((info, index)=>(
                                                                    
                                                                    <Link key={"info-array-"+(typeof(info) == "string" ? info : info.id)+index} to={(typeof(info) == "string" ? "#" : ROUTES.PLAYERS + "/" + info.slug)} className={`d-block w-100 h-100 p-2 ${index%2 != 0 ? "border-top" : ""}`}>
                                                                        <img
                                                                                src={typeof(info) == "string" ? teamPlaceholder : info.countryTeam != null ? info.countryTeam.image != null ? info.countryTeam.image : teamPlaceholder : teamPlaceholder}
                                                                                className="iq-card-icon avatar-30 mr-1"
                                                                            />
                                                                        {(typeof(info) == "string" ? info : info.name)}
                                                                    </Link>
                                                                ))
                                                            }
                                                        </td>
                                                    )
                                                }
                                                </>
                                            )
                                        }
                                        
                                        {
                                            typeof(data[value]) == "string" && (
                                                <td>
                                                    {data[value]}
                                                </td>
                                            )
                                        }
                                    </tr>
                                }
                                </>
                            ))
                        }
                    </tbody>
                </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default InfoTab