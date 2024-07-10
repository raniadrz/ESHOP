import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import './HeroSection.css';

const images = [
  "https://png.pngtree.com/background/20210711/original/pngtree-pet-simple-white-banner-picture-image_1064801.jpg",
  "https://t3.ftcdn.net/jpg/04/81/32/08/360_F_481320874_0ySypkY4mZYl4jEmCOGXMbPgVhocmw2t.jpg",
  "https://t4.ftcdn.net/jpg/03/17/04/61/360_F_317046136_p8XC7kCPSyelhxe54mbXWJbUI6iMShM7.jpg"
];

const HeroSection = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
  };

  return (
    <div className="hero-slider">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <img className="h-44 lg:h-full w-full object-cover" src={image} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSection;
