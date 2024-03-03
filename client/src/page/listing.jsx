import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import {Navigation} from 'swiper/modules';
import 'swiper/css/bundle';
import {FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare} from 'react-icons/fa'

const Listing = () => {
  SwiperCore.use([Navigation]);
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/listing/get/${listingId}`);
            const data = await res.json();
            if (data.success === false) {
                setError(true);
                setLoading(false);
                return;
            }
            setListing(data);
        } catch (error) {
            setError(true);            
        } finally {
            setLoading(false);
        }
    }

    fetchListing();
  }, [])

  return (
    <main>
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center">Something went wrong.</p>}
        {listing && !loading && !error && (
            <>
                <Swiper navigation>
                    {listing.imageUrls.map((url) => (
                        <SwiperSlide key={url}>
                            <div
                            className='h-[550px]'
                            style={{
                                background: `url(${url}) center no-repeat`,
                                backgroundSize: 'cover',
                            }}
                            ></div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="fixed top-[13%] right-[3%] bg-white cursor-pointer border rounded-full w-12 z-10 h-12 flex items-center text-white justify-center">
                    <FaShare 
                        className="text-slate-500"
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            setCopied(true);
                            setTimeout(() => {
                                setCopied(false);
                            }, 2000);
                        }}
                    />
                </div>
                {copied &&( 
                   <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-3">
                      Link Copied
                  </p>
                )}
                <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
                    <p className='text-2xl font-semibold'>
                        {listing.name} - ${' '}
                        {listing.offer
                            ? listing.discountedPrice
                            : listing.reqularPrice}
                        {listing.type === 'rent' && ' / month'}
                    </p>
                    <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm">
                        <FaMapMarkerAlt className="text-green-700"/>
                        {listing.address}
                    </p>
                    <div className="flex gap-4">
                        <p className="bg-red-800 w-full  rounded-lg p-3 text-center font-semibold text-xl text-white max-w-[200px]">
                            {listing.type === 'rent' ? "for Rent" : "For sale"}
                        </p>
                        {listing.offer && (
                            <p className="bg-green-800 w-full  rounded-lg p-3 text-center font-semibold text-xl text-white max-w-[200px]">${+listing.reqularPrice}</p>
                        )}
                    </div>
                    <p className="text-slate-700">
                        <span className="font-semibold text-black">
                            Description -
                        </span>
                        {listing.description}
                    </p>
                    <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
                        <li className="flex items-center gap-1 whitespace-nowrap ">
                            <FaBed className="text-lg" />
                            {listing.bedrooms > 1 ? `${listing.bedrooms} beds `: `${listing.bedrooms} bed`}
                        </li>
                        <li className="flex items-center gap-1 whitespace-nowrap ">
                            <FaBed className="text-lg" />
                            {listing.bathrooms > 1 ? `${listing.bathrooms} baths `: `${listing.bathrooms} bath`}
                        </li>
                        <li className="flex items-center gap-1 whitespace-nowrap ">
                            <FaParking className="text-lg" />
                            {listing.parking ? "Parking" : "No Parking"}
                        </li>
                        <li className="flex items-center gap-1 whitespace-nowrap ">
                            <FaChair className="text-lg" />
                            {listing.furnished ? "Furnishad" : "No Furnished"}
                        </li>
                    </ul>
                </div>
            </>
        )}
    </main>
  )
}

export default Listing