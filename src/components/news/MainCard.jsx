import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { ShimmerText, ShimmerThumbnail, ShimmerTitle } from "react-shimmer-effects";
import { LazyLoadImage } from "react-lazy-load-image-component"


import PlaceholderImage from 'src/assets/images/placeholder.png'
import { TimeSince } from "src/utils/TimeSince";


MainCard.propTypes = {
  newsData: PropTypes.object,
};
function MainCard({ newsData }) {
  if (newsData == null) {
    return <PlaceHolderMainCard />
  }

  console.log(newsData);
  // a function defined in another file in the same directory
  let formatted_date_time = TimeSince(newsData.publishedAt);

  return (
    <Link
    to={"/news/"+newsData.slug}
      className="card news-main-card custom-card p-2"
    >
      <div className="row no-gutters align-items-center">
        <div className="col-md-6">
        <LazyLoadImage 
            src={newsData.coverImage != null ? newsData.coverImage : PlaceholderImage }
            onError={(e)=>e.target.src = PlaceholderImage}
            className="card-img border rounded news-main-card-image"
            alt="Image"
          />
        </div>
        <div className="col-md-6">
          <div className="card-body d-flex flex-column justify-content-start">
            <h4 className="card-title news-main-card-title">
              {newsData.title}
            </h4>
            <p className="card-text">{newsData.description}</p>
            <p className="card-text news-main-card-stamp">
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

function PlaceHolderMainCard() {
  return (
    <div className="card news-main-card custom-card p-2">
      <div className="row no-gutters align-items-center">
        <div className="col-md-6">
          <ShimmerThumbnail
            height={230}
            className="card-img rounded news-main-card-image m-0"
          />
        </div>
        <div className="col-md-6">
          <div className="card-body d-flex flex-column justify-content-start">
            <ShimmerTitle line={2} gap={10} className="card-title news-main-card-title mb-4" variant="primary" />
            <ShimmerText line={3} gap={10} className="card-text" />
            <ShimmerText line={1} gap={10} 
            className="card-text news-side-card-stamp text-muted w-30" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainCard;
