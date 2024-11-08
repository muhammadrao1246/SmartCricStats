import React from 'react'
import DisplayCard from './DisplayCard';


// All tabs route with respect to the tab name defined
let genders = [
  "MENS",
  "WOMENS"
]
let allowed_formats = {
  MENS: ["TEST", "ODI", "T20I"],
  WOMENS: ["ODI", "T20I"],
};
let roles = [
  "Batting",
  "Bowling",
  "All-Rounder"
]
function PlayersRankingTab() {
  return (
    <>
    
      <div className="row">
        {
            genders.map((valueGender, index)=>(
                <>
                    {
                      roles.map((valueRole, index)=>(
                        <>
                          <div className="col-lg-12">
                              <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
                                  <div className="iq-card-header d-flex justify-content-between">
                                      <div className="iq-header-title">
                                          <h4 className="card-title"> ICC {(valueGender == "MENS" ? "Men's" : "Women's")} {valueRole} Rankings </h4>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div className="col-lg-12">
                                  <div className="row">
                                      {
                                          allowed_formats[valueGender].map((valueFormatAllowed, index)=>{
                                              return (
                                                  <DisplayCard key={index} type="player" role={valueRole} gender={valueGender} format={valueFormatAllowed} colClass={"col-lg-4"} />
                                                  
                                              )
                                          })
                                      }
                              </div>
                          </div>
                        </>
                      ))
                    }
                </>
            ))
        }
    </div>
    </>
  );
}

export default PlayersRankingTab