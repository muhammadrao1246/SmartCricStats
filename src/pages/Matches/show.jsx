import React, { useState } from "react";
import {Link, useLoaderData, useLocation, useOutletContext} from "react-router-dom"

// a package used to make network requests effectively in reactJS like Fetch and AJAX
// they can also be used but it is easy
import axios from "axios";

// importing paths of image svg file from image folder
import teamPlaceholder from "src/assets/images/team_placeholder.svg";
import playerPlaceholder from "src/assets/images/player_placeholder.svg";

// loading 
import "src/assets/css/matches.css";

import MatchScoreCard from "src/components/livescore/MatchScoreCard";
import OverviewTab from "./tabs/OverviewTab";
import InfoTab from "./tabs/InfoTab";
import ScoreCardTab from "./tabs/ScoreCardTab";
import BallByBallTab from "./tabs/BallByBallTab";
import StatsTab from "./tabs/StatsTab";

import TabList from "src/components/Layouts/TabList";
import ReportTab from "./tabs/ReportTab";
import { FindImageDominantColor } from "src/utils/utils";
import RelatedNews from "src/components/widgets/RelatedNews";
import NewsTab from "./tabs/NewsTab";

let placeholder_data = (status) => {
  return {
    teams: [
      {
        abbreviation: "TEAM A",
        shortName: "TEAM A",
        image: teamPlaceholder,
        score: status != "UPCOMING" ? "195-3" : null,
        overs: "19.5/20 Ov",
      },
      {
        abbreviation: "TEAM B",
        shortName: "TEAM B",
        image: teamPlaceholder,
        score: status != "UPCOMING" ? "195-3" : null,
        overs: "19.5/20 Ov",
      },
    ],
    match: {
      batting: status != "info" && status != "scorecard" ? "TEAM A" : null,
      format: "TEST",
      title: "1st Test",
      status: status,
      statusInfo: "Live Matches Are Being Loaded..",
      startDate: "2024-02-23T00:00:00.000Z",
      startTime: "2024-02-23T04:00:00.000Z",
      endDate: "2024-02-27T00:00:00.000Z",
    },
    stadium: {
      shortName: "Stadium",
    },
    series: {
      shortName: "Series",
      isTrophy: false,
    },
  };
};


// Tab array will be passed to tab list component 
// so the component can create tab items with specific routes and having certain names on them


// when a tab is clicked we will get a tab route name from out url ?tab="anything"
// then on next render of this component we will going to select the respective tab
// like this tab_content_map["overview"] which will return the respective content
// also we can use tab_content_map.get("overview", "scorecard") which will return "overview" component 
// but if it is not present then it will be returning the "scorecard" component with this key in this key
const tab_content_map = match=>({
  overview: <OverviewTab match={match} key={match.slug} />,
  info: <InfoTab match={match} key={match.slug} />,
  scorecard: <ScoreCardTab match={match} key={match.slug} />,
  ballbyball: <BallByBallTab match={match} key={match.slug} />,
  statistics: <StatsTab match={match} key={match.slug} />,
  analysis: <ReportTab match={match} key={match.slug} />,
  news: <NewsTab match={match} key={match.slug} />
});

// default colors for team one and team two
let teamColors = [
  "#03a9f4",
  "#dd0000"
]


// a component returning the match detail information
// with scores, information, ball by ball stats, statistics
export default function MatchDetail() {
  // for showing progress on top of the page in red line
  // we will obtain the controller variable which will be these used to change
  // line percentage from 0% to 10% to 100% (if page loaded)
  const [progress, setProgress] = useOutletContext();


  // we will get parameters from our URL like
  // our this component url is like
  // localhost:5173/matches/:slug     (slug can be a name of match with date like 'pak-vs-aus-123123')
  const responseJSON = useLoaderData() 
  let match = responseJSON.data 
  match.defaultColors = teamColors

  let TAB_ARRAY = [
  ]
  if (match.isSaved) {
    TAB_ARRAY = [...TAB_ARRAY, ...[ 
      {route: 'overview', name: "Overview"},
    ]]
  }
  
  const TABBING_MAP = tab_content_map(match)
  if (!match.isSaved) {
    delete TABBING_MAP["overview"]
    delete TABBING_MAP["scorecard"]
    delete TABBING_MAP["ballbyball"]
    delete TABBING_MAP["statistics"]
  }

  TAB_ARRAY = [...TAB_ARRAY, ...[      
    {route: 'info', name: "Info"},
  ]]  
  if (match.isSaved) {
    TAB_ARRAY = [...TAB_ARRAY, ...[      
      {route: 'scorecard', name: "ScoreCard"},
      {route: 'ballbyball', name: "Ball By Ball"},
      {route: 'statistics', name: "Statistics"},
    ]]
  }
  

  TAB_ARRAY = [...TAB_ARRAY, ...[      
      {route: 'analysis', name: "Analysis Report"},
      {route: 'news', name: "News"},
    ]]


  // these type of url params (?tab=overview) from localhost:5173/series/series_slug/match_slug/?tab=scorecard
  // we have to get them like this
  // useLocation used to get current URL object from which we can obtain
  // ?tab=21231 part by using useLocation().search attribute
  const params = new URLSearchParams(useLocation().search) // parsing to get info like this {tab: "overview"}



  const [tab, setTab] = useState(params.size > 0 ? params.get("tab", TAB_ARRAY[0].route) : TAB_ARRAY[0].route);

  // let temp_card_data = placeholder_data("LIVE");

    // color selection
    // React.useEffect(()=>{
      Object.keys(match.teams).map((teamName, index)=>{
        let defaultColor = teamColors[index]
        if(match.teams[teamName].color == null){
          if(match.teams[teamName].image != null){
            let obtainedColor = FindImageDominantColor(match.teams[teamName].image)
            
            obtainedColor.then(resolve=>{
              match.teams[teamName].color = resolve
              match.idToTeam[match.teams[teamName].id].color = obtainedColor
            })
          }
          else{
            match.teams[teamName].color = defaultColor
            match.idToTeam[match.teams[teamName].id].color = defaultColor
          }
        }
      })
    // },[tab])

    

  // console.log(tab)
  // console.log(data)

  // React.useEffect(() => {
  //   setProgress(50)
  //   setTimeout(() => {
  //     axios.get("http://127.0.0.1:8000/api/live", {
  //       method: 'GET'
  //     })
  //     .then(response=>{
  //       // console.log(response.data)
  //       seconds = 10000
  //       let all_matches_data = response.data.data
  //     })
  //     .catch(error=>{
  //       console.log(error)
  //     })
  //     .finally(()=>{

  //     })
  //   }, seconds);
  // },[data]);

  return (
    <>
      {/* Page Content  */}
      <div className="col-lg-8">
        <div className="row">
          <div className="col-lg-12">
            <div className="iq-card iq-card-block iq-card-stretch iq-card-height overflow-hidden">
              <div className="iq-card-body">
                {/* MATCH SCORE CARD COMPONENT  
                  will display match info in a card like in above LiveScores list
                */}
                <MatchScoreCard
                  team1={match.teams[match.teamOneName]}
                  team2={match.teams[match.teamTwoName]}
                  match={match}
                  stadium={match.ground}
                  series={match.series}
                  scores={match.scoresText}
                />
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <TabList
                tabArray={TAB_ARRAY}
                currentTab={tab}
                onClick={setTab}
              />
          </div>
          {/* HERE IS ON COMPONENT RENDER */}
          {/* the current selected component by tab will be rendered "overview" -> OverViewTab */}
          {tab_content_map(match)[tab]}
        </div>
      </div>
      <div className="col-lg-4">
        {
          tab != "news" && 
          <RelatedNews 
            key={match.slug}
            queryParams={match.newsQuery}
            title={"Related News"}
            viewMoreLink={"?tab=news"}
            onClick={()=>setTab("news")}
          />
        }
      </div>
    </>
  );
}
