// Hero Slider Component
import React, { useState, useEffect,useContext } from 'react';
const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const slides = [
    {
      id: 1,
      image: "https://www.pcrm.org/sites/default/files/2022-04/Peas.jpg",
      title: "Fresh Organic Vegetables",
      description: "Farm-fresh vegetables delivered to your doorstep",
      cta: "Shop Now"
    },
    {
      id: 2,
      image: "https://static3.webx.pk/files/18781/Images/mix-dried-fresh-fruits-01-18781-0-111024021856280.png",
      title: "Premium Quality Fruits",
      description: "Handpicked fruits for your family",
      cta: "Explore"
    },
    {
      id: 3,
      image: "https://www.freshfarms.com/wp-content/uploads/2022/04/1.jpg",
      title: "Daily Fresh Dairy",
      description: "Pure dairy products for healthy living",
      cta: "View Products"
    },
    {
      id: 3,
      image: "https://media.koelnmesse.io/ism/redaktionell/ism/img/teaser/snacks_m24_full_m36_1025.jpg",
      title: "Daily Fresh Snacks",
      description: "Pure dairy products for healthy living",
      cta: "View Products"
    },
    {
      id: 3,
      image: "https://static.tossdown.com/images/88c684398fdcd02e0cf958f8ddb068d6.jpeg",
      title: "Daily Fresh Bakery",
      description: "Pure dairy products for healthy living",
      cta: "View Products"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(current => (current === slides.length - 1 ? 0 : current + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative h-96 md:h-96 lg:h-96 overflow-hidden">
      {slides.map((slide, index) => (
        <div 
          key={slide.id} 
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img 
            src={slide.image} 
            alt={slide.title} 
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gray bg-opacity-50" />
          <div className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-16">
            <div className="max-w-lg">
              <h2 className="text-white text-3xl md:text-5xl font-bold mb-4 animate-fadeInUp">{slide.title}</h2>
              <p className="text-white text-lg md:text-xl mb-6 animate-fadeInUp animation-delay-200">{slide.description}</p>
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 animate-fadeInUp animation-delay-400">
                {slide.cta}
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {/* Slider Indicators */}
      <div className="absolute bottom-5 left-0 right-0 z-20">
        <div className="flex justify-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full ${
                index === current ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;