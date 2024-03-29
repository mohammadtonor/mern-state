import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart, 
  updateUserfailure,
  updateUserSuccess,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserfailure,
  signOutstart,
  signOutfailure,
  signOutSuccess
}from './../redux/user/userSlice';
import {Link} from 'react-router-dom';

// allow read;
// allow write: if 
// request.resource.size < 2 * 1024 * 1024 && 
// request.resource.contentType.matches('iamge/.*')

export const Profile = () => {
  const fileRef = useRef(null);
  const [updatedSuccess, setUpdatedSuccess] = useState(false); 
  const { currentUser, loading, error } = useSelector(state => state.user);
  const [file, setFile] = useState(undefined);
  const [filePer, setFilePer] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [showListingError, setListingError] = useState(false);
  const dispatch = useDispatch();
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
    if (file) {
      handleUpload(file);
    }
  }, [file]);

  const handleUpload = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name ;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on("state_changed", 
      (snapShot) => {
        const progress = (snapShot.bytesTransferred / snapShot.totalBytes ) * 100;
        setFilePer(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => 
          setFormData({...formData, avatar: downloadURL})
        )
      })
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res =await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserfailure(data.message));
        return;
      }
       dispatch(updateUserSuccess(data));
       setUpdatedSuccess(true)
    } catch (error) {
      dispatch(updateUserfailure(error));
    }
  }
  
  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserfailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserfailure(error));
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutstart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutfailure(data.message));
        return;
      }
      console.log(data);
      dispatch(signOutSuccess(data));
    } catch (error) {
      dispatch(signOutfailure(error.message));
    }
  }

  const handleShowListing = async () => {
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`)
      const data = await res.json();
      if (data.success === false) {
        setListingError(true);
        return;
      }
      setUserListings(data)
    } catch (error) {
      setListingError(true);
    }
  }

  const handleListingDelete = async (itemId) => {
    try {
      const res = await fetch(`/api/listing/delete/${itemId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        setListingError(true);
        return;
      }
      setUserListing((prev) => prev.filter(listing => listing._id !== itemId));
    } catch (error) {
      
    }
  }

  return (
    <div className='mx-auto max-w-md sm:max-w-lg'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

        <input 
          hidden 
          type='file' 
          ref={fileRef} 
          accept='image/*'
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} className='w-24 h-24 object-cover cursor-pointer self-center rounded-full' alt='avatar'/>
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-500'>Error Image Upload (image nust be less than 2 mb)</span>
          ) : filePer > 0 && filePer < 100 ? (
            <span className='text-blue-700'>{filePer}%</span>
          ) : filePer === 100 ? (
            <span className='text-green-700'>Image Upload succesfully!</span>
          ): ("")}
        </p>

        <input 
          type='text' 
          placeholder='username' 
          id='username' 
          defaultValue={currentUser.username}
          className='p-3 border rounded-lg'
          onChange={handleChange}
        />
        <input 
          type='text'
          placeholder='email' 
          id='email' 
          defaultValue={currentUser.email}
          className='p-3 border rounded-lg'
          onChange={handleChange}
        />
        <input 
          type='text'
          placeholder='password' 
          id='password'
          className='p-3 border rounded-lg'
          onChange={handleChange}
        />
        
        <button
           className='bg-blue-700 text-white p-3 rounded-lg uppercase hover:opacity-85 text-md font-semibold'>
            {loading ? "loading..." : "Update"}
        </button>
        <Link 
          to='/create-listing' 
          className='bg-green-600 text-white rounded-lg uppercase hover:opacity-85 p-3 text-center text-md font-semibold'>
            Create Lising
          </Link>
      </form>
      <div className='flex justify-between items-center mt-4'>
        <span onClick={handleDelete} className='text-red-700 cursor-pointer text-md font-semibold'>Delete acount</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer text-md font-semibold'>Sign Out</span>
      </div>
      <p className='text-red-500 font-semibold text-md'>{error ? error : ""}</p>
      <p className='text-green-700 font-semibold text-md'>{updatedSuccess ? "Profile updated successful!" : ""}</p>
      <button onClick={handleShowListing} className='text-green-700 w-full'>Show Listing</button>
      <p className='text-red-700'>{showListingError ? 'Error hapaned while fetching error!': null}</p>
      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
