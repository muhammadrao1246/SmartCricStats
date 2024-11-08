import React from "react";
import { useOutletContext } from "react-router-dom";

// import {ROUTES} from "../../routes/urls.jsx";
import Rankings from "../components/widgets/Rankings.jsx";
import News from "../components/widgets/News.jsx";
import RegionNews from "../components/widgets/RegionNews.jsx";


export default function Home() {

  // const [progress, setProgress] = useOutletContext()
  // React.useEffect(()=>{
  //   setProgress(100)
  // },[])
  
  
  return (
    <>
      {/* Page Content  */}
      <div className="col-lg-8">
        <div className="row">
          <div className="col-lg-12">
            <News title="Latest Stories" />
          </div>
          <div className="col-lg-12">
            <RegionNews title="Cricket " />
          </div>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="row">
          <div className="col-lg-12">
            <Rankings title="ICC Team Rankings" type="TEAM" />
          </div>
          <div className="col-lg-12">
            <Rankings title="ICC Player Rankings" type="PLAYER" />
          </div>
        </div>
      </div>
    </>
  );
}
