
const CreateListing = () => {
  return (
    <main className="max-w-md sm:max-w-3xl lg:max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7">Create a Listing</h1>
        <form className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col gap-4 flex-1">
                <input type="text" placeholder="Name" className="border p-3 rounded-lg" id='name' maxLength='62' minLength={10} required/>
                <textarea type="text" placeholder="Description" className="border p-3 rounded-lg" id='description' required/>
                <input type="text" placeholder="Address" className="border p-3 rounded-lg" id='address'  required/>
                <div className="flex gap-4">
                    <div className="flex gap-4">
                        <input type="checkbox" id='sale' className="w-4"/>
                        <span>Sell</span>
                    </div>
                    <div className="flex gap-4">
                        <input type="checkbox" id='rent' className="w-4"/>
                        <span>Rent</span>
                    </div><div className="flex gap-4">
                        <input type="checkbox" id='parking' className="w-4"/>
                        <span>Parking spot</span>
                    </div><div className="flex gap-4">
                        <input type="checkbox" id='furnished' className="w-4"/>
                        <span>Furnished</span>
                    </div>
                    <div className="flex gap-4">
                        <input type="checkbox" id='offer' className="w-4"/>
                        <span>Offer</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                        <input type="number" className="p-3 border-gray-300 rounded-lg border " id="bedrooms" placeholder="bedrooms" min='1' max={10} required/>
                        <p>Beds</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number" className="p-3 border-gray-300 rounded-lg border " id="bathrooms" placeholder="bedrooms" min='1' max={10} required/>
                        <p>Bathrooms</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number" className="p-3 border-gray-300 rounded-lg border " id="reqularPrice" placeholder="bedrooms" min='0' required/>
                        <p>Reqular Price</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number" className="p-3 border-gray-300 rounded-lg border " id="discountedPrice" placeholder="bedrooms" min='0'  required/>
                        <p>Discounted Price</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-1 gap-2">
                <p className="font-semibold">Images: 
                    <span className="font-normal text-gray-600 ml-2">The first image 
                        will be the cover (max 6)
                    </span>
                </p>
                <div className="flex gap-4">
                    <input type="file" id="images" accept="image/*" multiple 
                    className="p-3 border border-gray-300 rounded w-full"/>
                    <button className="text-green-700 border border-green-700 rounded p-3 uppercase hover:shadow-sm disabled:opacity-80">
                        Upload
                    </button>
                </div>
                <button className="bg-blue-800 text-white p-3 rounded-lg font-semibold uppercase text-lg hover:bg-opacity-85 disabled:bg-gray-600">
                    Create  Listing</button>
            </div>
        </form>
    </main>
  )
}

export default CreateListing;
