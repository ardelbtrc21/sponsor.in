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
    <div className="w-full overflow-hidden">
      <Swiper
        modules={[Autoplay]}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        grabCursor={true}
        spaceBetween={30}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="carousel-slide">
              <img src={src} alt={`Image ${index + 1}`} className="w-full h-auto object-cover" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageCarousel;
