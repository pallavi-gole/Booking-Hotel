import React from 'react'
import Hero from '../components/Hero';
import MostPicked from '../components/MostPicked';
import PopularRooms from '../components/PopularRooms';
import Testimonials from '../components/Testimonials';
import NewsLetter from '../components/NewsLetter';

const Home = () => {
  return (
    <div className='py-24'>
      <Hero />
      <MostPicked />
      <PopularRooms />
      <Testimonials />
      <NewsLetter />
    </div>
  );
}

export default Home;
