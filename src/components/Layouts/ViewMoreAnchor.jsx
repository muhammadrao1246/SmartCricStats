import React from "react";
import { Link } from "react-router-dom";


function ViewMoreAnchor({text, link, onClick}) {
  return (
    <div className="iq-card-body p-0">
      <div className="mt-3 border-top d-flex justify-content-center p-2 w-100">
        <Link
          onClick={onClick}
          to={link}
          className="view-more-anchor"
        >
          {text}
        </Link>
      </div>
    </div>
  );
}

export default ViewMoreAnchor;
