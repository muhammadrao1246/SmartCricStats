$(document).ready(function () {
    $(".livescore-scorecard-container").slick({
      // centerMode: true,
      // centerPadding: '60px',
      slidesToShow: 4,
      infinite: false,
      swipeToSlide: true,
      slidesToScroll: 1,
      variableWidth: true,
      responsive: [
        {
          breakpoint: 1325,
          settings: {
            slidesToShow: 3,
          },
        },
        {
          breakpoint: 1000,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 678,
          settings: {
            slidesToShow: 1,
          },
        },
      ],
      nextArrow:
        '<a href="#" style="top: unset;line-height:normal;" class="p-1 shadow border text-black rounded ri-arrow-right-s-line right"></a>',
      prevArrow:
        '<a href="#" style="top: unset;line-height:normal;" class="p-1 shadow border text-black rounded ri-arrow-left-s-line left"></a>',
    });
  
    // setInterval(()=>{
    //   $(".livescore-scorecard-container").slick("refresh")
    // }, 100)
});
