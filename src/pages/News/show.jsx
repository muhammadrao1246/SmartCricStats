import React from "react";
import { useOutletContext, useParams, Link } from "react-router-dom";
import axios from "axios";

import "src/assets/css/news.css";
import DetailCard from "src/components/news/DetailCard";


export default function NewsDetail() {
  const [progress, setProgress] = useOutletContext();

  // let params = new URLSearchParams(window.location.search)

  const {slug} = useParams();
  const [news, setNews] = React.useState(null);
  
  
  // a function defined in another file in the same directory

  React.useEffect(() => {
    setProgress(50);
    window.scrollTo(0,0)
    axios
      .get("http://127.0.0.1:8000/api/news/" + slug, {
        method: "GET",
      })
      .then((response) => {
        console.log(response);

        setProgress(100);
        setNews(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      {/* Page Content  */}
      <div className="col-lg-8">
        <div className="row">
          <div className="col-lg-12">
            <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
              <div className="iq-card-header d-flex justify-content-between">
                <div className="iq-header-title">
                  <Link to="/news" className="card-title"> News </Link>
                </div>
                <div className="iq-card-header-toolbar d-flex align-items-center"></div>
              </div>
              <div className="iq-card-body pt-0">
                <div className="row align-items-center">
                  <div className="col-lg-12">
                    <DetailCard newsData={news} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="row">
          <div className="col-lg-12"></div>
        </div>
      </div>
    </>
  );
}
