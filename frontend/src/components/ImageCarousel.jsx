import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from 'swiper/modules'; 
import Image1 from "../assets/landing_page_1.jpg";
import Image2 from "../assets/landing_page_2.jpg";
import Image3 from "../assets/landing_page_3.jpg";
import "../Style/styles.css";

const ImageCarousel = () => {
  const images = [Image1, Image2, Image3, Image1, Image2, Image3];

  return (
    <div className="carousel-container">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={150}
        slidesPerView={5}
        loop={true}
        autoplay={{
          delay: 2500,       
          disableOnInteraction: false, 
        }}
        grabCursor={true}
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="carousel-slide">
              <img src={src} alt={`Image ${index + 1}`} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
  
};

export default ImageCarousel;
