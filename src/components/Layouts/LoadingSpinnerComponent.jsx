import React from 'react'

function LoadingSpinnerComponent({cardClass}) {
    return (
      <div className={`iq-card iq-card-block iq-card-stretch iq-card-height ${cardClass}`}>
        <div className="iq-card-body">
          <div className="row">
            <div className="col-lg-12">
              <div className="d-flex w-100 justify-content-center p-3">
                <div
                  className="spinner-border text-muted font-weight-bold"
                  role="status"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

export default LoadingSpinnerComponent