import React from "react";
import PropTypes from "prop-types"
import axios from "axios"


import HorizontalCard from "src/components/news/HorizontalCard";

import "src/assets/css/news.css";


RegionNews.propTypes = {
    title: PropTypes.string.isRequired,
}
let regions = [
  "Australia",
  "Bangladesh",
  "England",
  "India",
  "New Zealand",
  "Pakistan",
  "South Africa",
  "Sri Lanka",
  "West Indies",
  "Zimbabwe"
]
function RegionNews({title}) {
  let hour = React.useRef(0);

  // news data
  const [newsData, setBlogsData] = React.useState([null,null,null,null,null,null]);
  const [randomRegion] = React.useState(regions[randomNumberInRange(0, (regions.length - 1))])

  // fetching Data From API
  React.useEffect(()=>{
    setTimeout(() => {
      axios.get("http://127.0.0.1:8000/api/news/", {
          method: 'GET',
          params: {
            page_size: 6,
            region__iexact: randomRegion,
            ordering: "-publishedAt"
          }
      }).then((response)=>{
          console.log(response)
          hour.current = 36e5
          setBlogsData(response.data.data.results)
      })
      .catch(error=>{
        console.log(error)
      })
    }, hour.current);
  },[newsData, randomRegion])

  return (
    <div className="iq-card iq-card-block iq-card-stretch iq-card-height border">
      <div className="iq-card-header d-flex justify-content-between">
        <div className="iq-header-title">
          <h4 className="card-title"> {title + randomRegion} </h4>
        </div>
        <div className="iq-card-header-toolbar d-flex align-items-center"></div>
      </div>
      <div className="iq-card-body pt-0">
        <div className="row align-items-center">
          <div className="col-lg-12">
            <div className="row">
              {
                newsData.map((value, index)=>{
                  return (
                    <div className="col-sm-6" key={index}>
                      <HorizontalCard newsData={value} />
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function randomNumberInRange(min, max) {
  // 👇️ get number between min (inclusive) and max (inclusive)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default RegionNews