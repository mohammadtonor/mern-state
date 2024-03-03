import React from 'react'

const Search = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-[2fr_3fr] lg:col-span-[3fr_5fr] max-w-6xl mx-auto'>
        <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
            <form className='flex flex-col gap-7'>
                <div className='flex items-center gap-2 '>
                    <label className='whitespace-nowrap'>Search Term</label>
                    <input
                        id='searchTerm' 
                        type="text" 
                        placeholder="Search..." 
                        className='border rounded-lg p-3 w-full'
                    />
                </div>
                <div className='flex gap-2 flex-wrap '>
                    <label>Type: </label>
                    <div className='flex gap-1'>
                        <input type="checkbox" id='type' />
                        Rent & Sell
                    </div>
                    <div className='flex gap-1'>
                        <input type="checkbox" id='rent'/>
                        Rent
                    </div>
                    <div className='flex gap-1'>
                        <input type="checkbox" id='sale' />
                        Sale
                    </div>
                    <div className='flex gap-1'>
                        <input type="checkbox" id='offer' />
                        Offer
                    </div>
                </div>
                <div className='flex gap-2 flex-wrap '>
                    <label>Ameneties: </label>
                    <div className='flex gap-1'>
                        <input type="checkbox" id='parking' />
                        Parking
                    </div>
                    <div className='flex gap-1'>
                        <input type="checkbox" id='furnished'/>
                        Furnished
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <label>Sort:</label>
                    <select className='p-3 border rounded-lg text-gray-700' id='sort_order'>
                        <option>Price hight to low</option>
                        <option>Price low to hight</option>
                        <option>Latest</option>
                        <option>Oldest</option>
                    </select>
                </div>
                <button className='bg-slate-700 uppercase text-white p-3 hover:opacity-85 rounded'>Search</button>
            </form>
        </div>
        <div className='p-4'>
            <h1 className='text-2xl font-semibold '>
                Listing Result
            </h1>
        </div>
    </div>
  )
}

export default Search