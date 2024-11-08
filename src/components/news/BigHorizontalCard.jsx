import { LazyLoadImage } from "react-lazy-load-image-component";
import PropTypes from 'prop-types'
import { ShimmerText, ShimmerThumbnail, ShimmerTitle } from "react-shimmer-effects";
import { Link } from "react-router-dom";


import PlaceholderImage from "src/assets/images/placeholder.png";
import { TimeSince } from "src/utils/TimeSince";


BigHorizontalCard.propTypes = {
  newsData: PropTypes.object,
};
function BigHorizontalCard({newsData}) {

  if (newsData == null) {
    return <PlaceHolderBigHorizontalCard />
  }

  // a function defined in another file in the same directory
  let formatted_date_time = TimeSince(newsData.publishedAt);
  
  return (
    <Link to={"/news/"+newsData.slug} className="card p-2 custom-card list-card">
      <div className="row no-gutters align-items-center">
        <div className="col-sm-5">
          <LazyLoadImage
            src={newsData.coverImage != null ? newsData.coverImage : PlaceholderImage }
            onError={(e)=>e.target.src = PlaceholderImage}
            className="card-img border rounded list-image"
            alt="Image"
          />
        </div>
        <div className="col-sm-7">
          <div className="card-body d-flex flex-column justify-content-start">
            <h4 className="card-title list-title">
              {newsData.title}
            </h4>
            <p className="card-text list-description">
              {newsData.description}
            </p>
            <p className="card-text list-stamp">
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

function PlaceHolderBigHorizontalCard() {
  return (
    <div className="card p-2 list-card">
      <div className="row no-gutters align-items-center">
        <div className="col-sm-5">
          <ShimmerThumbnail 
          height={225}
          className="card-img rounded news-side-card-image m-0" />
        </div>
        <div className="col-sm-7">
          <div className="card-body d-flex flex-column justify-content-start">
            
            
            <ShimmerTitle line={2} gap={10} variant="secondary" className="card-title list-title" />
            <ShimmerText line={3} gap={10} className="card-text list-description" />
            <ShimmerText line={1} gap={10} className="card-text list-stamp text-muted w-40" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BigHorizontalCard;
