import { LazyLoadImage } from "react-lazy-load-image-component";
import PropTypes from 'prop-types'
import { ShimmerText, ShimmerThumbnail, ShimmerTitle } from "react-shimmer-effects";


import PlaceholderImage from "src/assets/images/placeholder.png";
import { TimeSince } from "src/utils/TimeSince";


DetailCard.propTypes = {
  newsData: PropTypes.object,
};
function DetailCard({ newsData }) {
  
  if (newsData == null) {
    return <PlaceHolderDetailCard />;
  }

  console.log(newsData);
  // a function defined in another file in the same directory
  let formatted_date_time = TimeSince(newsData.publishedAt);
  
  return (
    <div className="card detail-card">
      <div className="row no-gutters align-items-center">
        <div className="col-lg-12">
          <div className="card-body detail-head">
            <h2 className="card-title detail-title">{newsData.title}</h2>
            <p className="card-text detail-stamp">
              <small className="text-muted">
                {formatted_date_time[0] + " • " + formatted_date_time[1]}
              </small>
            </p>
            <hr />
            <p className="card-text detail-description">
              {newsData.description}
            </p>
          </div>
        </div>
        <div className="col-lg-12 d-flex justify-content-center">
          <LazyLoadImage
            src={
              newsData.mediaImages != null
                ? newsData.mediaImages[0] != null
                  ? newsData.mediaImages[0].url
                  : PlaceholderImage
                : PlaceholderImage
            }
            onError={(e)=>e.target.src = PlaceholderImage}
            className="card-img rounded detail-image"
            alt="Image"
          />
        </div>
        <div className="col-lg-12">
          <div className="card-body detail-footer d-flex flex-column justify-content-start">
            {
                newsData.content.map((para, index)=>{
                    return <p key={index} className="card-text detail-content" dangerouslySetInnerHTML={{__html: para}}>
                        
                    </p>
                })
            }
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceHolderDetailCard() {
  return (
    <div className="card detail-card">
      <div className="row no-gutters align-items-center">
        <div className="col-sm-12">
          <div className="card-body m-0 mb-2">
            <ShimmerTitle
                line={2}
                gap={10}
                className="card-title detail-title"
                variant="primary"
            />
            <ShimmerTitle variant="secondary" line={1} gap={10} className="card-text detail-stamp text-muted w-30" />
            <hr />
            <ShimmerText
              line={3}
              gap={10}
              className="card-text detail-description"
            />
          </div>
        </div>
        <div className="col-sm-12">
          <ShimmerThumbnail
            height={500}
            className="card-img rounded detail-image w-100 m-0 p-2"
          />
        </div>
        <div className="col-sm-12">
          <div className="card-body d-flex flex-column justify-content-start">
          <ShimmerText
              line={7}
              gap={10}
              className="card-text detail-content"
            />
            <ShimmerText
              line={5}
              gap={10}
              className="card-text detail-content"
            />
            <ShimmerText
              line={4}
              gap={10}
              className="card-text detail-content"
            />
            <ShimmerText
              line={3}
              gap={10}
              className="card-text detail-content"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailCard;
