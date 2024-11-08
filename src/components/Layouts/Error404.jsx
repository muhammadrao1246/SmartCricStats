import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "src/routes/urls";



function Error404() {
  return (
    <div className="col-sm-12 text-center">
      <div className="iq-error">
        <img
          src="/images/error/01.png"
          className="img-fluid iq-error-img"
          alt=""
        />
        <h2 className="mb-0">Oops! This Page is Not Found.</h2>
        <p>The requested page dose not exist.</p>
        <Link className="btn btn-primary mt-3" to={ROUTES.HOME}>
          <i className="ri-home-4-line" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default Error404;
