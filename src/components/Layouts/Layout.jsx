import React, { useState } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { Suspense } from "react";
import LoadingBar from 'react-top-loading-bar'


// importing website css
import "src/assets/css/theme.css";
import "src/assets/css/light-typography.css"

// importing livescore widget responsible for showing livescores on top
import LiveScore from "src/components/widgets/LiveScore"

// importing page structure components
import Header from "src/components/Layouts/Header/Header";
import Footer from "src/components/Layouts/Footer/Footer";

import { ROUTES } from "src/routes/urls";

function ScreenLoader(){
  return (
    <>
    {/* preloader */}
    <div
          id="loading"
          style={{ backgroundImage: "url('/custom/images/throw.png')" }}
        >
          <div id="loading-center"></div>
        </div>
    </>
  )
}


function Layout() {
  const [progress, setProgress] = useState(30)
  const [loading, setLoading] = useState(true)


  
  React.useEffect(()=>{
    setTimeout(() => {
      setLoading(false)
    }, 3000);
  },[])

  return (
    <>
      <LoadingBar
          color="var(--logo-primary-color)"
          progress={progress}
          height={5}
          // ref={loader}
          onLoaderFinished={()=>setProgress(0)}
        />
        {
          loading && <ScreenLoader />
        }
      {/* Wrapper Start */}
      <div className="wrapper">
        
        <Header />
        <main>
          <div id="content-page" className="content-page">
            <div className="container-fluid">
              <div className="row">
                
                <LiveScore />
                <Suspense fallback={ScreenLoader}>
                  <Outlet context={[progress, setProgress]} />
                </Suspense>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
      <ScrollRestoration />
    </>
  );
}

export default Layout;
