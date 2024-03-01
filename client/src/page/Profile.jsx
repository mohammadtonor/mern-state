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
  const dispatch = useDispatch();

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
           className='bg-blue-700 text-white p-3 rounded-lg uppercase hover:opacity-85 text-lg font-semibold'>
            {loading ? "loading..." : "Update"}
        </button>
      </form>
      <div className='flex justify-between items-center mt-4'>
        <span onClick={handleDelete} className='text-red-700 cursor-pointer text-md font-semibold'>Delete acount</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer text-md font-semibold'>Sign Out</span>
      </div>
      <p className='text-red-500 font-semibold text-md'>{error ? error : ""}</p>
      <p className='text-green-700 font-semibold text-md'>{updatedSuccess ? "Profile updated successful!" : ""}</p>
    </div>
  )
}
