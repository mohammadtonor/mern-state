import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom';
import {FaLockOpen, FaSpider} from 'react-icons/fa'

const Search = () => {
  const navigaete = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [sidebarDate, setSidebarData] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort:  "createdAt",
    order: "desc"
  });  

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
        searchTermFromUrl || 
        typeFromUrl ||
        parkingFromUrl ||
        furnishedFromUrl ||
        offerFromUrl ||
        sortFromUrl ||
        orderFromUrl
    ) {
        setSidebarData({
            searchTerm: searchTermFromUrl || '',
            type: typeFromUrl || 'all',
            parking: parkingFromUrl === 'true' ? true : false,
            furnished: furnishedFromUrl === 'true' ? true : false,
            offer: offerFromUrl === 'true' ? true : false,
            sort: sortFromUrl || 'createdAt',
            order: orderFromUrl  || 'desc'
        })
    }

    const fetchListing = async () => {
        setLoading(true);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        setListings(data);
        setLoading(false);
    }

    fetchListing();
  }, [location.search])

  const handleChange = (e) => {
    if(e.target.id === 'all' || e.target.id === 'sale' || e.target.id === 'rent') {
        setSidebarData({...sidebarDate, type: e.target.id});
    }

    if(e.target.id === 'searchTerm'){ 
        setSidebarData({...sidebarDate, searchTerm: e.target.value});
    }

    if(e.target.id === 'offer' || e.target.id === 'parking' || e.target.id === 'furnished') {
        setSidebarData({...sidebarDate, [e.target.id]: !!e.target.checked});
    }

    if(e.target.id === 'sort_order') {
        const sort = e.target.value.split('_')[0] || 'createdAt';
        const order = e.target.value.split('_')[1] || 'desc';
        setSidebarData({...sidebarDate, sort, order});
    }
  } 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams =  new URLSearchParams()
    urlParams.set('searchTerm', sidebarDate.searchTerm);
    urlParams.set('type', sidebarDate.type);
    urlParams.set('parking', sidebarDate.parking);
    urlParams.set('furnished', sidebarDate.furnished);
    urlParams.set('offer', sidebarDate.offer);
    urlParams.set('sort', sidebarDate.sort);
    urlParams.set('order', sidebarDate.order);
    const searchquery = urlParams.toString();
    navigaete(`/search?${searchquery}`)

  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-[2fr_3fr] lg:col-span-[3fr_5fr] max-w-6xl mx-auto'>
        <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-7'>
                <div className='flex items-center gap-2 '>
                    <label className='whitespace-nowrap'>Search Term</label>
                    <input
                        id='searchTerm' 
                        type="text" 
                        placeholder="Search..." 
                        onChange={handleChange}
                        value={sidebarDate.searchTerm}
                        className='border rounded-lg p-3 w-full'
                    />
                </div>
                <div className='flex gap-2 flex-wrap '>
                    <label>Type: </label>
                    <div className='flex gap-1'>
                        <input type="checkbox" id='all'
                            onChange={handleChange} 
                            checked={sidebarDate.type === 'all'}
                         />
                        Rent & Sell
                    </div>
                    <div className='flex gap-1'>
                        <input type="checkbox" id='rent'
                            onChange={handleChange} 
                            checked={sidebarDate.type === 'rent'}
                        />
                        Rent
                    </div>
                    <div className='flex gap-1'>
                        <input type="checkbox" id='sale' 
                            onChange={handleChange} 
                            checked={sidebarDate.type === 'sale'}
                        />
                        Sale
                    </div>
                    <div className='flex gap-1'>
                        <input type="checkbox" id='offer'
                            onChange={handleChange} 
                            checked={sidebarDate.offer}
                        />
                        Offer
                    </div>
                </div>
                <div className='flex gap-2 flex-wrap '>
                    <label>Ameneties: </label>
                    <div className='flex gap-1'>
                        <input type="checkbox" id='parking'
                            onChange={handleChange} 
                            checked={sidebarDate.parking}
                        />
                        Parking
                    </div>
                    <div className='flex gap-1'>
                        <input type="checkbox" id='furnished'
                            onChange={handleChange} 
                            checked={sidebarDate.furnished}
                        />
                        Furnished
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                    <label>Sort:</label>
                    <select 
                        className='p-3 border rounded-lg text-gray-700' id='sort_order'
                        onChange={handleChange}
                        defaultValue='createdAt_desc'
                    >
                        <option value='regularPrice_desc'>Price hight to low</option>
                        <option value='regularPrice_asc'>Price low to hight</option>
                        <option value='createdAt_desc'>Latest</option>
                        <option value={'createdAt_asc'}>Oldest</option>
                    </select>
                </div>
                <button className='bg-slate-700 uppercase text-white p-3 hover:opacity-85 rounded'>Search</button>
            </form>
        </div>
        {loading && (
            <div className='h-full w-full bg-black/20 justify-center items-center flex '>
                <FaLockOpen className='text-white/40 w-20 h-20'/>
            </div>
        )}
        <div className=''>
            <h1 className='text-2xl font-semibold text-slate-700 mt-5 p-3'>
                Listing Result
            </h1> 
        </div>
    </div>
  )
}

export default Search