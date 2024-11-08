import React from "react";
import {Link, useLoaderData, useLocation} from "react-router-dom"


import "src/assets/css/players.css";
import TabList from "src/components/Layouts/TabList";
import OverviewTab from "./tabs/OverviewTab";


import playerPlaceholder from "src/assets/images/player_placeholder.svg";
import teamPlaceholder from "src/assets/images/team_placeholder.svg";
import { ROUTES } from "src/routes/urls";
import StatisticsTab from "./tabs/StatisticsTab";
import NewsTab from "./tabs/NewsTab";
import MatchesTab from "./tabs/MatchesTab";
import PerformanceTab from "./tabs/PerformanceTab";
import { FindPlayerImage } from "src/utils/utils";
import RelatedNews from "src/components/widgets/RelatedNews";


function PlayerInfo({ heading, content, CardClass, colClass = "col-lg-4" }) {
  return (
    <div className={`${colClass}`} >
      <div className={`card detail_player_heading_card ${CardClass}`} >
        <h4 className="detail_player_heading text-muted">{heading}</h4>
        <h4 className="detail_player_content" >{content}</h4>
      </div>
    </div>
  );
}

// All tabs route with respect to the tab name defined
let TABS_ARRAY = [
  {route: "overview", name: "Overview"},
  {route: "statistics", name: "Statistics"},
  {route: "matches", name: "Matches"},
  {route: "news", name: "News"},
  // {route: "performance", name: "Performace Analysis"},
]


let TAB_MAP = (player) => ({
  overview : <OverviewTab player={player} key={player.slug} />,  
  statistics : <StatisticsTab player={player}  key={player.slug} />,
  matches : <MatchesTab player={player}  key={player.slug} />,
  news : <NewsTab  player={player} key={player.slug} />,
  // performance : <PerformanceTab  player={player} key={player.slug} />,
})

let attributes_to_title = {
  "fullName": "Full Name",
  "birth": "Born",
  "death": "Died",
  "age": "Age",
  "aka": "Also Known As",
  "nickName": "Nick Name",
  "fieldingName": "Fielding Name",
  "height": "Height",
  "education": "Education",
  "playerRole": "Playing Role",
  "battingStyle": "Batting Style",
  "bowlingStyle": "Bowling Style",
  "fieldingStyle": "Fielding Style",
  "otherString": "Other",
  "relations": "Relations"
}

function PlayerDetail() {

  // const [progress, setProgress] = useOutletContext();

  // for sending an api call
  const responseJSON = useLoaderData() // the player data requested will be returned
  let player = responseJSON.data 

  // getting current url with search params like ?tab=overview
  const params = new URLSearchParams(useLocation().search)
  const [tab, setTab] = React.useState(params.size == 0 ? TABS_ARRAY[0].route : params.get("tab", TABS_ARRAY[0].route))
  
  const TABBING_MAP = TAB_MAP(player)

  // here the page content is defined
  return (
    <>
      {/* Page Content  */}
      <div className="col-lg-12" key={player.slug+"-container"}>
        <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
          <div className="iq-card-body">
            <div className="row">
              <div className="col-lg-3">
                <div className="card w- h-100 align-items-center justify-content-center">
                  <img
                    src={FindPlayerImage(player)}
                    alt=""
                    className="img-fluid detail_player_image border p-2"
                  />
                </div>
              </div>
              <div className="col-lg-9 p-3">
                <div className="row">
                  {Object.keys(attributes_to_title).map((value, index) => (
                    <>
                      {typeof player[value] == "string" &&
                        player[value] != null && (
                          <PlayerInfo
                            key={player.slug+"-"+value}
                            heading={attributes_to_title[value]}
                            content={player[value]}
                            CardClass={"mt-3"}
                          />
                        )}
                    </>
                  ))}

                  {player["relations"].length > 0 && (
                    <PlayerInfo
                      heading={"Relations"}
                      content={player["relations"].map((value, index) => (
                        <>
                          <Link
                            key={player.slug+"-relation-"+index}
                            to={ROUTES.PLAYERS + "/" + value.player.slug}
                            className="text-anchor"
                          >
                            {value.player.name}
                          </Link> <span className="text-muted small">({value.relation})</span>
                          {
                            index < player["relations"].length - 1 &&
                            <span className="text-muted">, </span>
                          }
                        </>
                      ))}
                      CardClass={"mt-3"}
                      colClass={"col-lg-12"}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-8">
        <div className="row">
          <div className="col-lg-12">
            <TabList key={player.slug+"-tablist"} tabArray={TABS_ARRAY} currentTab={tab} onClick={setTab} />
          </div>
          <div className="col-lg-12">
              {TABBING_MAP[tab]}
          </div>
        </div>
      </div>
      <div className="col-lg-4">
        {
          tab != "news" && 
          <RelatedNews 
            key={player.slug + "-relatedNews"}
            queryParams={{
              description__icontains: player.name}}
            title={"Related News"}
            viewMoreLink={"?tab=news"}
            onClick={()=>setTab("news")}
          />
        }
      </div>
    </>
  );
}

export default PlayerDetail;
