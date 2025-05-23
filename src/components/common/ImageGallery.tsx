import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface ImageGalleryProps {
  images: string[];
  className?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, className = '' }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    adaptiveHeight: true
  };

  // If no images, show placeholder
  if (!images || images.length === 0) {
    return (
      <div className={`bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <p className="text-gray-500 p-8">No images available</p>
      </div>
    );
  }

  // If single image, don't use slider
  if (images.length === 1) {
    return (
      <div className={`rounded-lg overflow-hidden ${className}`}>
        <img 
          src={images[0]} 
          alt="Giveaway"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden ${className}`}>
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="outline-none">
            <img 
              src={image} 
              alt={`Giveaway slide ${index + 1}`} 
              className="w-full h-64 object-cover"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageGallery;