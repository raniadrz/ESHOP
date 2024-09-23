import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import './HeroSection.css';
import puppy from'./puppy.jpg'
import puppy2 from './puppy2.jpg'
const images = [
  "https://png.pngtree.com/background/20210711/original/pngtree-pet-simple-white-banner-picture-image_1064801.jpg",
  puppy,
  "https://t4.ftcdn.net/jpg/03/17/04/61/360_F_317046136_p8XC7kCPSyelhxe54mbXWJbUI6iMShM7.jpg",
  puppy2
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
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: false,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          arrows: false,
          dots: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          dots: true,
        },
      },
    ],
  };

  return (
    <div className="hero-slider">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="slider-item">
            <img className="hero-image" src={image} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSection;
