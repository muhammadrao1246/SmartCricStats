import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { ShimmerText, ShimmerThumbnail, ShimmerTitle } from "react-shimmer-effects";
import { LazyLoadImage } from "react-lazy-load-image-component"


import PlaceholderImage from 'src/assets/images/placeholder.png'
import { TimeSince } from "src/utils/TimeSince";

SubCard.propTypes = {
  newsData: PropTypes.object.isRequired,
};

function SubCard({ newsData }) {

  if (newsData == null) {
    return <PlaceHolderSubCard />
  }

  // a function defined in another file in the same directory
  let formatted_date_time = TimeSince(newsData.publishedAt);

  return (
    <Link
    to={"/news/"+newsData.slug}
      className="card news-main-card p-2 news-side-card custom-card"
    >
      <div className="row no-gutters align-items-center">
        <div className="col-sm-12">
        <LazyLoadImage 
            src={newsData.coverImage != null ? newsData.coverImage : PlaceholderImage }
            onError={(e)=>e.target.src = PlaceholderImage}
            className="card-img border rounded news-side-card-image"
            alt="Image"
          />
        </div>
        <div className="col-sm-12">
          <div className="card-body d-flex flex-column justify-content-start">
            <h4 className="card-title news-side-card-title">
              {newsData.title}
            </h4>
            <p className="card-text news-side-card-description">
              {newsData.description}
            </p>
            <p className="card-text news-side-card-stamp">
              <small className="text-muted">
                {formatted_date_time[0] + " • " + formatted_date_time[1]}
              </small>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}


function PlaceHolderSubCard() {
  return (
    <div className="card news-main-card p-2 news-side-card custom-card">
      <div className="row no-gutters align-items-center">
        <div className="col-sm-12">
          <ShimmerThumbnail 
          height={150}
          className="card-img rounded news-side-card-image m-0" />
        </div>
        <div className="col-sm-12">
          <div className="card-body d-flex flex-column justify-content-start">
            
            <ShimmerTitle line={2} gap={10} variant="secondary" className="card-title news-side-card-title" />
            <ShimmerText line={3} gap={10} className="card-text news-side-card-description" />
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubCard;
