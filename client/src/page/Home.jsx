import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import {Navigation} from 'swiper/modules';
import ListingItem from '../components/ListingItem';

export const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentalListings, setRentalListings] = useState([]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res =  await fetch(`/api/listing/get?offer=true&limit=4`)
        const data = await res.json();
        setOfferListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    }

    const fetchSaleListings = async () => {
      try {
        const res =  await fetch(`/api/listing/get?type=sale&limit=4`)
        const data = await res.json();
        setSaleListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    }
    
    const fetchRentListings = async () => {
      try {
        const res =  await fetch(`/api/listing/get?type=rent&limit=4`)
        const data = await res.json();
        setRentalListings(data);
      } catch (error) {
        console.log(error);
      }
    }
    
    fetchOfferListings()
  }, [])

  console.log(offerListings.length);
  return (
    <div>
      <div className='p-28 px-3 flex flex-col max-w-6xl mx-auto gap-6'>
        <h1 className=' mt-4 text-2xl font-semibold '>
          Find your next <span className='text-slate-500'>perfect</span>
          <br />
          place with ease
        </h1>
        <p className='text-slate-400 text-sm font-semibold'>
          We Have wide range of properties for you to chose from
          We Have wide range of properties for you to chose from
          We Have wide range of properties for you to chose from
        </p>
        <Link to={'/search'} className='text-blue-900 text-sm font-semibold hover:underline'>Let`s get started...</Link>
      </div>

      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${listing.imageUrls[1]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className='h-[500px]'
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>
      
      <div className='flex flex-col max-w-6xl mx-auto p-2 gap-8  my-10'>
        {offerListings && offerListings.length > 0 && (
          <div className=''>
            <h2 className='text-2xl font-semibold'>
              Recent offers
            </h2>
            <Link to={'/search?offer=true'}>Show more offer</Link>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 my-4 gap-2 items-center'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing}/>
              ))}
            </div>  
          </div>

        )}

        {saleListings && saleListings.length > 0 && (
          <div className=''>
            <h2 className='text-2xl font-semibold'>
              Recent Sales
            </h2>
            <Link to={'/search?type=sale'}>Show more sale</Link>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 my-4 gap-2 items-center'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing}/>
              ))}
            </div>  
          </div>

        )}

      {rentalListings && rentalListings.length > 0 && (
          <div className=''>
            <h2 className='text-2xl font-semibold'>
              Recent Rent
            </h2>
            <Link to={'/search?type=rent'}>Show more rent</Link>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 my-4 gap-2 items-center'>
              {rentalListings.map((listing) => (
                <ListingItem listing={listing}/>
              ))}
            </div>  
          </div>

        )}
      </div>
    </div>
  )
}
