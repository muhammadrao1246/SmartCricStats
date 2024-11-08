import React from "react";

function DataNotFoundMessage({ message, colClass, cardClass = "" }) {
  return (
    <div className={colClass}>
      <div className={`iq-card iq-card-block iq-card-stretch iq-card-height ${cardClass}`}>
        <div className="iq-card-body">
          <div className="row">
            <div className="col-lg-12">
              <div className="d-flex w-100 justify-content-center">
                <h5>{message}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataNotFoundMessage;
