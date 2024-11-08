import React, { useState } from "react";
import { Link, useLocation, useOutletContext } from "react-router-dom";
import axios from "axios";
import PropTypes from 'prop-types'


import "src/assets/css/matches.css";
import Card from "src/components/livescore/card";
import SmallMatchScoreCard from '../livescore/SmallMatchScoreCard';
import LoadingSpinnerComponent from '../Layouts/LoadingSpinnerComponent';
import DataNotFoundMessage from "../Layouts/DataNotFoundMessage";


let filter_by_tab = (data, tab)=>{
  return data.filter((stat)=>{
    if (tab == "UPCOMING" && stat.match.status == "UPCOMING")
      return true
    else if (tab == "RESULT" && stat.match.status == "RESULT")
      return true
    else if(stat.match.status != "RESULT" && stat.match.status != "UPCOMING" && tab == "LIVE" )
      return true
    else 
    return false
  
  })
}
let seconds = 0

MatchTab.propTypes = {
    data: PropTypes.array,
    tab: PropTypes.string,
}
// tab will be LIVE, RESULT, UPCOMING
export default function MatchTab({tab}) {
  const [progress, setProgress] = useOutletContext();
  // console.log(data)
  // let tab_filtered = filter_by_tab(data, tab)
  const [data, setData] = React.useState(null)
  const [live, setLive] = useState(true)
  // console.log(tab_filtered)


  
  const fetchMatches = (aborter)=>{
    setProgress(50)
    // axios.get("http://127.0.0.1:8000/api/live", {
      axios.get(`http://127.0.0.1:8000/api/matches/${tab}`, {
        method: 'GET',
        params: {
          tab: true,
        },
        cancelToken: aborter.token
      })
      .then(response=>{
        // console.log(response.data)
        seconds = 10000
        let all_matches_data = response.data.data.results
        if (tab == "live" && live) {
          setData(all_matches_data)
        }else if(tab != "live"){
          setData(all_matches_data)
        }
        setProgress(50)
      })
      // .catch(error=>{
      //   console.log(error)
      // })
      .finally(()=>{
        setProgress(100)
      })
  }

    React.useEffect(() => {
      if (tab != "live" ) return
      
      const source = axios.CancelToken.source();
      setTimeout(() => {
        fetchMatches(source)
      }, seconds);

      return ()=>{
        source.cancel()
      }
    },[live, data]);

    
    React.useEffect(() => {
      if (tab == "live") {
        seconds = 0
        setLive(true)
        return
      }
      else{
        setLive(false)
      }
      setData(null)
      console.log(tab)
      
      const source = axios.CancelToken.source();
      fetchMatches(source)

      return ()=>{
        source.cancel()
      }
    },[tab]);

  if (data == null) {
    return <LoadingSpinnerComponent cardClass={"m-0"} />
  }
  else if (data.length == 0) {
    return <div className="row">
      <DataNotFoundMessage 
      message={"No Matches Found!"}
      colClass={"col-lg-12"}
    />
    </div>
  }
  
  return (
    <>
      {/* Page Content  */}
      <div className="iq-card-body">
        <div className="row align-items-center">
          <div className="col-lg-12">
            <div className="row tab-container">
              {
                data.map((match, index)=>{
                    // console.log(value)
                    return (
                    <div key={index} className="col-lg-6">
                        {/* <Card
                            team1={value.teams[0]}
                            team2={value.teams[1]}
                            match={value.match}
                            stadium={value.stadium}
                            series={value.series}    
                        /> */}
                        
                        <SmallMatchScoreCard
                            key={match.slug}
                            team1={match["teams"][match["teamOneName"]]}
                            team2={match["teams"][match["teamTwoName"]]}
                            match={match}
                            stadium={match["ground"]}
                            series={match["series"]}
                            scores={match["scoresText"]}
                            
                        />
                    </div>
                )})
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
