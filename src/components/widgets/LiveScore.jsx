import React from "react";
import axios from "axios";


import "src/assets/css/livescore.css";

import teamPlaceholder from '../../assets/images/team_placeholder.svg'

import LiveScoreSlider from "src/components/livescore/LiveScoreSlider";
import LiveScoreSliderArrow from "src/components/livescore/LiveScoreSliderArrow";
import { ROUTES } from "src/routes/urls";
import { useLocation, useParams } from "react-router-dom";


const SLICK_LIVESCORE_SETTINGS = {
  // centerMode: true,
  // centerPadding: '100px',
  slidesToShow: 3,
  infinite: false,
  swipeToSlide: true,
  slidesToScroll: 3,
  variableWidth: true,
  arrows: true,
  responsive: [
    {
      breakpoint: 1175,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        variableWidth: true,
      },
    },
    {
      breakpoint: 801,
      settings: {
        variableWidth: true,
        arrows: true,
      },
    },
    {
      breakpoint: 800,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        // variableWidth: false,
        arrows: false,
      },
    },
    {
      breakpoint: 426,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        variableWidth: false,
        arrows: false,
      },
    },
  ],
  nextArrow: <LiveScoreSliderArrow />,
  prevArrow: <LiveScoreSliderArrow />,
}

// var placeholder_data = {
//   teams: [
//     {
//       "abbreviation": "TEAM A",
//       "shortName": "TEAM A",
//       "image": teamPlaceholder,
//       "score": "195-3",
//       "scoreInfo": "19.5/20 Ov"
//     },
//     {
//       "abbreviation": "TEAM B",
//       "shortName": "TEAM B",
//       "image": teamPlaceholder,
//       "score": "195-3",
//       "scoreInfo": "19.5/20 Ov"
//     }
//   ],
//   match: {
//     "batting": "TEAM A",
//     "format": "TEST",
//     "title": "1st Test",
//     "status": "LIVE",
//     "statusInfo": "Live Matches Are Being Loaded..",
//     "startDate": "2024-02-23T00:00:00.000Z",
//     "startTime": "2024-02-23T04:00:00.000Z",
//     "endDate": "2024-02-27T00:00:00.000Z"
//   },
//   stadium:{
//     "shortName": "Stadium"
//   },
//   series:{
//     "shortName": "Series",
//     "isTrophy": false
//   }
// }

var placeholder_data = {
  teams: {
    "TEAM A": {
      "abbreviation": "TEAM A",
      "shortName": "TEAM A",
      "longName": "TEAM A",
      "image": null,
      "score": "195-3",
      "scoreInfo": "19.5/20 Ov"
    },
    "TEAM B": {
      "abbreviation": "TEAM B",
      "shortName": "TEAM B",
      "longName": "TEAM B",
      "image": null,
      "score": "195-3",
      "scoreInfo": "19.5/20 Ov"
    }
  },
  scoresText: {
      "TEAM A": {
          score: "124/2",
          overs: "15.6"
      },
      "TEAM B": {
          score: "124/2",
          overs: "15.6"
      }
  },
    "lastBatting": "TEAM A",
    "format": "TEST",
    "title": "1st Test",
    "status": "RESULT",
    teamOneName: "TEAM A",
    teamTwoName: "TEAM B",
    slug: "match-1",
    
    "statusText": "Live Matches Are Being Loaded..",
    "startDate": "2024-02-23T00:00:00.000Z",
    "startTime": "2024-02-23T04:00:00.000Z",
    "endDate": "2024-02-27T00:00:00.000Z"
  ,
  ground:{
    "shortName": "Stadium"
  },
  series:{
    "shortName": "Series",
    "isTrophy": false
  }
}


let seconds = 0;
function LiveScore() {
  
  // const sliderRef = us 
  let [liveScore ,setLiveScore] = React.useState(Array.from({length:50}, (value)=> value = placeholder_data))

  // console.log(liveScore)
  
  const location = useLocation();
  const currentRoute = location.pathname; 

  const {match_slug, series_slug} = useParams()
  

  // fetching live matches
  React.useEffect(()=>{
    setTimeout(() => {
      if(currentRoute != ROUTES.LIVESCORES)
      {
        // axios.get("http://127.0.0.1:8000/api/live", {
        axios.get("http://127.0.0.1:8000/api/matches/live", {
          method: 'GET',
          // params: {

          // }
        })
        .then(response=>{
          // console.log(response.data)
          seconds = 10000
          let matches = response.data.data.results
          if (!!match_slug) {
            console.log(match_slug)
            matches = matches.filter(value=>value.slug != match_slug)
          }
          setLiveScore(matches)
          // $(".livescore-scorecard-container").slick(SLICK_LIVESCORE_SETTINGS)
        })
        .catch(error=>{
          console.log(error)
        })
        .finally(()=>{
          
        })
      }
    }, seconds);
  }, [liveScore, match_slug])


  return (
    <div className={`col-sm-12 transition ${(currentRoute != ROUTES.LIVESCORES ? "" : "transition_opening")}`}>
      <div className="iq-card iq-card-block iq-card-stretch iq-card-height overflow-hidden">
        <div className="iq-card-body">
          <div className="row">
            {/* <div className="col-sm-12 d-flex align-items-center livescore-scorecard-container"> */}
              
              <LiveScoreSlider data={liveScore} settings={SLICK_LIVESCORE_SETTINGS}/>
              
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}


export default LiveScore;
