import React, { useRef } from "react";
import PropTypes from "prop-types"
import axios from "axios"

import "src/assets/css/news.css"

import MainCard from "src/components/news/MainCard";
import SubCard from "src/components/news/SubCard";


News.propTypes = {
    title: PropTypes.string.isRequired,
}
function News({title}) {
    let hour = useRef(0);
    // news data
    const [newsData, setNewsData] = React.useState([null,null,null,null]);
    
    // fetching Data From API
    React.useEffect(()=>{
      setTimeout(() => {
        axios.get("http://127.0.0.1:8000/api/news/", {
            method: 'GET',
            params: {
              region__iexact: "global",
              page_size: 4,
              ordering: "-publishedAt"
            }
        }).then((response)=>{
            console.log(response)
            hour.current = 36e5
            setNewsData(response.data.data.results)
        })
        .catch(error=>{
          console.log(error)
        })
      }, hour.current);
    },[newsData])


  return (
    <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
      <div className="iq-card-header d-flex justify-content-between">
        <div className="iq-header-title">
          <h4 className="card-title"> {title} </h4>
        </div>
        <div className="iq-card-header-toolbar d-flex align-items-center"></div>
      </div>
      <div className="iq-card-body pt-0">
        <div className="row align-items-center">
          <div className="col-lg-12">
            <MainCard newsData={newsData[0]} />
          </div>
          <div className="col-lg-12">
            <div className="row">
              {
                newsData.slice(1).map((value, index)=>{
                  return (
                    <div className="col-md-4" key={index}>
                      <SubCard newsData={value} />
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default News;
