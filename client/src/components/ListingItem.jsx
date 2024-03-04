import React from 'react'
import { Link } from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'

const ListingItem = ({listing}) => {
  return (
    <div className='bg-white flex flex-col hover:shadow-lg p-2 hover:scale-105  duration-300 transition-all rounded-lg'>
        <Link to={`/listing/${listing._id}`}>
            <img src={listing.imageUrls[0]} className='h-[320px] sm:h-[220px] w-full
            object-cover '/>
            <div className='p-2 flex flex-col gap-2 w-full'>
                <p className='text-lg font-semibold text-slate-700 truncate'>
                    {listing.name}
                </p>
                <div className='flex items-center gap-1'>
                    <MdLocationOn className='w-4 h-4 text-green-900'/>
                    <p className='text-gray-700 truncate text-sm'>{listing.address}</p>
                </div>
                <p className='line-clamp-2 text-sm text-gray-600'>
                    {listing.description}
                </p>
                <p className='text-slate-500 mt-2 font-semibold'>
                    {listing.offer ? listing.discountedPrice.toLocaleString('en-US') : listing.reqularPrice.toLocaleString('en-US')}
                    {listing.type === 'rent' ? ' / month': ''} 
                </p>
            </div>
        </Link>
    </div>
  )
}

export default ListingItem