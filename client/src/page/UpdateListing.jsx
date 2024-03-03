import { useEffect, useState } from "react";
import {useSelector} from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import {GoTrash} from 'react-icons/go'
import { useNavigate, useParams} from 'react-router-dom';

export const UpdateListing = () => {
    const { currentUser } = useSelector((state) => state.user);
    const navigaete = useNavigate();
    const params = useParams();
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        reqularPrice: 0,
        discountedPrice: 0,
        bathrooms: 1,
        bedrooms: 1,
        furnished: false,
        parking: false,
        type: 'rent',
        offer: false,
    });

    const [imageUploadError, setImageUploadError] = useState(null);
    const [uploading, setUploading] = useState(false)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchListing = async () =>  {
            const listingId = params.listingId
            const res = await  fetch(`/api/listing/get/${listingId}`);
            const data = await res.json();
            if (data.success === false) {
                setError(data.error)
            }

            setFormData(data);
        }

        fetchListing();
    }, [])

    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
          setUploading(true);
          setImageUploadError(false);
          const promises = [];
    
          for (let i = 0; i < files.length; i++) {
            promises.push(storeImages(files[i]));
          }
          Promise.all(promises)
            .then((urls) => {
              setFormData({
                ...formData,
                imageUrls: formData.imageUrls.concat(urls),
              });
              setImageUploadError(false);
              setUploading(false);
            })
            .catch((err) => {
              setImageUploadError('Image upload failed (2 mb max per image)');
              setUploading(false);
            });
        } else {
          setImageUploadError('You can only upload 6 images per listing');
          setUploading(false);
        }
      };

    const storeImages = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
              "state_changed", 
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes ) * 100;
                console.log(Math.round(progress));
              },
              (error) => {
                reject(error);
              },
              () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                })
              }
            )
        })
    }

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index )
        })
    };

    const handleChange = (e) => {
        if(e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({...formData, type: e.target.id})
        }

        if(e.target.id === 'offer' || e.target.id === 'parking' || e.target.id === 'furnished') {
            setFormData({...formData, [e.target.id]: e.target.checked});
        }

        if (e.target.type === 'number' || e.target.type === 'textarea' || e.target.type === 'text') {
            setFormData({
                ...formData, [e.target.id]: e.target.value
            })
        }
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.reqularPrice < formData.discountedPrice) return setError('Discount price must be less than regular price')
            if (formData.imageUrls.length < 1) return setError('You must upload at least one image')
            setLoading(true);
            setError(false);
            const listingId = params.listingId;
            const res = await fetch(`/api/listing/update/${listingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await res.json();
            setLoading(false);
            if(data.success === false) {
                setError(data.message);
                setLoading(false);
                return;
            }
            navigaete(`/listing/${data._id}`)
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }

  return (
    <main className="max-w-md sm:max-w-3xl lg:max-w-5xl mx-auto">
            {loading && 
                <div className=" justify-center flex items-center inset-0 fixed h-full w-full bg-black/35">
                    <div className="w-10 h-10 bg-white rounded-full">

                    </div>
                </div>
            }
            <h1 className="text-3xl font-semibold text-center my-7">Update Listing </h1>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-4 flex-1">
                    <input
                        onChange={handleChange}
                        value={formData.name} 
                        type="text" 
                        placeholder="Name" 
                        className="border p-3 rounded-lg"
                        id='name' maxLength='62'
                        minLength={10} 
                        required/>
                    <textarea 
                        onChange={handleChange}
                        value={formData.description}
                        type="text"
                        placeholder="Description"
                        className="border p-3 rounded-lg" 
                        id='description' 
                        required/>
                    <input
                        onChange={handleChange}
                        value={formData.address}
                        description 
                        type="text"
                         placeholder="Address" 
                         className="border p-3 rounded-lg" 
                         id='address'
                         required/>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex gap-4">
                            <input 
                                onChange={handleChange}
                                checked={formData.type === "sale"}
                                type="checkbox" 
                                id='sale' 
                                className="w-4"/>
                            <span>Sell</span>
                        </div>
                        <div className="flex gap-4">
                            <input
                                onChange={handleChange}
                                checked={formData.type === "rent"} 
                                type="checkbox" 
                                id='rent' 
                                className="w-4"/>
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-4">
                            <input 
                                onChange={handleChange}
                                checked={formData.parking}
                                type="checkbox" 
                                id='parking'
                                 className="w-4"/>
                            <span>Parking spot</span>
                        </div>
                        <div className="flex gap-4">
                            <input 
                                onChange={handleChange}
                                checked={formData.furnished}
                                type="checkbox" 
                                id='furnished' 
                                className="w-4"/>
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-4">
                            <input 
                                onChange={handleChange}
                                checked={formData.offer}
                                type="checkbox" 
                                id='offer' 
                                className="w-4"/>
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <input 
                                onChange={handleChange}
                                value={formData.bedrooms}
                                type="number"
                                className="p-3 border-gray-300 rounded-lg border " id="bedrooms" placeholder="bedrooms" min='1' max={10} required/>
                            <p>Beds</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input 
                                onChange={handleChange}
                                value={formData.bathrooms}
                                type="number"
                                className="p-3 border-gray-300 rounded-lg border " id="bathrooms" placeholder="bedrooms" min='1' max={10} required/>
                            <p>Bathrooms</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input 
                                onChange={handleChange}
                                value={formData.reqularPrice}
                                type="number" 
                                className="p-3 border-gray-300 rounded-lg border "
                                id="reqularPrice" 
                                placeholder="reqular Price" min='0' required/>
                            <p>Reqular Price</p>
                            {formData.type === 'rent' && <p>($pre / month)</p>}
                        </div>
                        {formData.offer && (
                            <div className="flex items-center gap-2">
                                <input 
                                    onChange={handleChange}
                                    value={formData.discountedPrice}
                                    type="number" 
                                    className="p-3 border-gray-300 rounded-lg border "
                                    id="discountedPrice" placeholder="bedrooms" min='0'  required/>
                                <p>Discounted Price</p>
                                {formData.type === 'rent' && <p>($pre / month)</p>}
                            </div>
                                )}
                    </div>
                </div>
                <div className="flex flex-col flex-1 gap-3">
                    <p className="font-semibold">Images: 
                        <span className="font-normal text-gray-600 ml-2">The first image 
                            will be the cover (max 6)
                        </span>
                    </p>
                    <div className="flex gap-4">
                        <input onChange={(e) => setFiles(e.target.files)} type="file" id="images" accept="image/*" multiple 
                        className="p-3 border border-gray-300 rounded w-full"/>
                        <button type="button" onClick={handleImageSubmit} className="text-green-700 border border-green-700 rounded p-3 uppercase hover:shadow-sm disabled:opacity-80">
                            {uploading ? "Uploading...": "Upload"}
                        </button>
                    </div>
                    {imageUploadError && <p className="text-red-700 p-3 text-md font-semibold"> {imageUploadError}</p>}
                    {formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                        <div className="flex items-center justify-between">
                            <img src={url} alt="image" className="w-40 h-40 object-cover rounded-lg"/>
                            <button onClick={() => handleRemoveImage(index)}><GoTrash className="mr-8 text-red-700 w-6 h-6"/></button>
                        </div>
                    ))}
                    <button
                        disabled={loading  || uploading} 
                        className="bg-blue-800 text-white p-3 rounded-lg font-semibold uppercase text-lg hover:bg-opacity-85 disabled:bg-gray-600">
                        {loading ? 'Updateig...' : 'Update  Listing'}
                    </button>
                    {error && <p className="text-red-700 texm-d">{error}</p>}
                </div>
            </form>
        </main>
  )
}
