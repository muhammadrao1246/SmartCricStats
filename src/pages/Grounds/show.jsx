import React from "react";
import {Link, useLoaderData, useLocation} from "react-router-dom"


import "src/assets/css/grounds.css";
import TabList from "src/components/Layouts/TabList";
import OverviewTab from "./tabs/OverviewTab";


import StatisticsTab from "./tabs/StatisticsTab";
import NewsTab from "./tabs/NewsTab";
import MatchesTab from "./tabs/MatchesTab";
import { FindGroundImage, FindPlayerImage } from "src/utils/utils";


function GroundInfo({ heading, content, CardClass, colClass = "col-lg-4" }) {
  return (
    <div className={`${colClass}`} >
      <div className={`card detail-ground-heading_card ${CardClass}`} >
        <h4 className="detail-ground-heading text-muted">{heading}</h4>
        <h4 className="detail-ground-content" >{content}</h4>
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
]


let TAB_MAP = (ground) => ({
  overview : <OverviewTab ground={ground} key={ground.slug} />,  
  statistics : <StatisticsTab ground={ground}  key={ground.slug} />,
  matches : <MatchesTab ground={ground}  key={ground.slug} />,
  news : <NewsTab ground={ground} key={ground.slug} />,
})

let attributes_to_title = {
  "name": "Stadium Name",
  "established": "Established",
  "aka": "Also Known As",
  "curator": "Curator",
  "capacity": "Capacity",
  "floodLights": "Flood Lights",
  "pitch": "Pitch",
  "namedAfter": "Named After",
  "totalArea": "Dimensions",
  "address": "Address",
  "endNames": "End Names",
  "otherSports": "Other Sports",
}
let omit_columns = [
  "address", "endNames", "otherSports"
]
function GroundDetail() {

  // const [progress, setProgress] = useOutletContext();

  // for sending an api call
  const responseJSON = useLoaderData() // the player data requested will be returned
  let ground = responseJSON.data 

  // getting current url with search params like ?tab=overview
  const params = new URLSearchParams(useLocation().search)
  const [tab, setTab] = React.useState(params.size == 0 ? TABS_ARRAY[0].route : params.get("tab", TABS_ARRAY[0].route))
  
  const TABBING_MAP = TAB_MAP(ground)

  // here the page content is defined
  return (
    <>
      {/* Page Content  */}
      <div className="col-lg-12" key={ground.slug+"-container"}>
        <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
          <div className="iq-card-body">
            <div className="row">
              <div className="col-lg-4">
                <div className="card h-100 align-items-center justify-content-center">
                  <img
                    src={FindGroundImage(ground)}
                    alt=""
                    className="img-fluid detail-ground-image border p-2"
                  />
                </div>
              </div>
              <div className="col-lg-8 p-3">
                <div className="row">
                  {Object.keys(attributes_to_title).map((value, index) => (
                    <>
                      {typeof ground[value] == "string" && !omit_columns.includes(value) &&
                        ground[value] != null && (
                          <GroundInfo
                            key={ground.slug+"-"+value}
                            heading={attributes_to_title[value]}
                            content={ground[value]}
                            CardClass={"mt-3"}
                          />
                        )}
                    </>
                  ))}
                  {ground["address"] != null && (
                    <GroundInfo
                    colClass="col-lg-6"
                    key={ground.slug+"-address"}
                    heading={attributes_to_title["address"]}
                    content={ground["address"]}
                    CardClass={"mt-3"}
                  />
                  )}
                  {ground["endNames"] != null && ground["endNames"].length > 0 && (
                    <GroundInfo
                    colClass="col-lg-6"
                    key={ground.slug+"-endNames"}
                    heading={attributes_to_title["endNames"]}
                    content={ground["endNames"].join(", ")}
                    CardClass={"mt-3"}
                  />
                  )}
                  {ground["otherSports"] != null && (
                    <GroundInfo
                    colClass="col-lg-12"
                    key={ground.slug+"-otherSports"}
                    heading={attributes_to_title["otherSports"]}
                    content={ground["otherSports"]}
                    CardClass={"mt-3"}
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
            <TabList key={ground.slug+"-tablist"} tabArray={TABS_ARRAY} currentTab={tab} onClick={setTab} />
          </div>
          <div className="col-lg-12">
              {TABBING_MAP[tab]}
          </div>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
          <div className="iq-card-body"></div>
        </div>
      </div>
    </>
  );
}

export default GroundDetail;
