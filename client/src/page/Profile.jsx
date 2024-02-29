import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { get } from 'mongoose';

// allow read;
// allow write: if 
// request.resource.size < 2 * 1024 * 1024 && 
// request.resource.contentType.matches('iamge/.*')

export const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser } = useSelector(state => state.user);
  const [file, setFile] = useState(undefined);
  const [filePer, setFilePer] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

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
  }

  return (
    <div className='mx-auto max-w-md sm:max-w-lg'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>

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
            <span className='text-red-500'>Error Image Upload (image nust be less than 2 mb)!</span>
          ) : filePer > 0 && filePer < 100 ? (
            <span className='text-blue-700'>{filePer}%</span>
          ) : filePer === 100 ? (
            <span className='text-green-700'>Image Upload succesfully!</span>
          ): ("")}
        </p>

        <input type='text' placeholder='username' id='username' className='p-3 border rounded-lg'/>
        <input type='text' placeholder='username' id='email' className='p-3 border rounded-lg'/>
        <input type='text' placeholder='username' id='password' className='p-3 border rounded-lg'/>
        
        <button
           className='bg-blue-700 text-white p-3 rounded-lg uppercase hover:opacity-85 text-lg font-semibold'>
            Update
        </button>
      </form>
      <div className='flex justify-between items-center mt-4'>
        <span className='text-red-700 cursor-pointer text-md font-semibold'>Delete acount</span>
        <span className='text-red-700 cursor-pointer text-md font-semibold'>Sign Out</span>
      </div>
    </div>
  )
}
