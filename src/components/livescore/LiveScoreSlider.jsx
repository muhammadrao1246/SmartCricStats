import Slider from 'react-slick'
import PropTypes from 'prop-types'


import Card from './card'
import SmallMatchScoreCard from './SmallMatchScoreCard'



function LiveScoreSlider({data, settings}) {
  return (
    <Slider className="col-sm-12 d-flex align-items-center livescore-scorecard-container" {...settings}>
        {
                  data.map((match, index)=>{
                    // console.log(livescore)
                    // return <Card
                    //   key={index}
                    //   team1={livescore.teams[0]}
                    //   team2={livescore.teams[1]}
                    //   match={livescore.match}
                    //   stadium={livescore.stadium}
                    //   series={livescore.series}
                    // />
                    
                    return <SmallMatchScoreCard
                        key={match.slug}
                        team1={match["teams"][match["teamOneName"]]}
                        team2={match["teams"][match["teamTwoName"]]}
                        match={match}
                        stadium={match["ground"]}
                        series={match["series"]}
                        scores={match["scoresText"]}
                        
                    />
                  })
         }
    </Slider>
  )
}

export default LiveScoreSlider