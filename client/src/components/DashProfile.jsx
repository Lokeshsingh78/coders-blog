import { Alert, Button, Modal, ModalBody, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setImageFileUploadError('File size must be less than 2MB');
        return;
      }
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    setImageFileUploadProgress(1); // Start progress
    
    try {
      // Create a FormData object to send the file
      const uploadData = new FormData();
      // Try different field names that the server might be expecting
      uploadData.append('image', imageFile); // Common field name
      
      console.log('File being uploaded:', imageFile.name, imageFile.type, imageFile.size);
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setImageFileUploadProgress(progress);
        },
        withCredentials: true
      };
      
      // Use the API endpoint without hardcoding localhost
      const response = await axios.post('/api/upload', uploadData, config);
      
      console.log('Server response:', response.data);
      
      if (response.data && response.data.url) {
        setImageFileUrl(response.data.url);
        setFormData(prev => ({ ...prev, profilePicture: response.data.url }));
        setImageFileUploadProgress(100);
        setTimeout(() => {
          setImageFileUploadProgress(null);
        }, 1000);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Upload error details:', error);
      let errorMessage = 'Could not upload image';
      
      if (error.response) {
        console.error('Error response data:', error.response.data);
        errorMessage = error.response.data.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'No response from server. Check your connection.';
      } else {
        errorMessage = error.message;
      }
      
      setImageFileUploadError(errorMessage);
      setImageFileUploadProgress(null);
    } finally {
      setImageFileUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made');
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError('Please wait for image to upload');
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };
  
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  return (
    <div className='max-w-xl mx-auto p-4 sm:p-6 w-full'>
      {/* Profile Header */}
      <div className='mb-8 pb-6 border-b border-slate-200/80 dark:border-slate-800/80'>
        <h2 className='text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white'>
          Account Profile & Security
        </h2>
        <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1'>
          Manage your credentials, author avatar, and publishing permissions
        </p>
      </div>

      <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
        <input
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />

        {/* Avatar Upload Area */}
        <div className='flex flex-col items-center justify-center gap-3 pb-4'>
          <div
            className='relative w-28 h-28 cursor-pointer rounded-full overflow-hidden ring-4 ring-indigo-500/20 shadow-md group bg-slate-100 dark:bg-slate-800'
            onClick={() => filePickerRef.current.click()}
            title='Click to change profile picture'
          >
            {imageFileUploadProgress && (
              <CircularProgressbar
                value={imageFileUploadProgress || 0}
                text={`${imageFileUploadProgress}%`}
                strokeWidth={5}
                styles={{
                  root: {
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 10,
                  },
                  path: {
                    stroke: `rgba(99, 102, 241, ${imageFileUploadProgress / 100})`,
                  },
                }}
              />
            )}
            <img
              src={imageFileUrl || currentUser.profilePicture || '/author.jpg'}
              alt={currentUser.username}
              className={`w-full h-full object-cover transition-opacity duration-200 ${
                imageFileUploadProgress && imageFileUploadProgress < 100
                  ? 'opacity-50'
                  : 'group-hover:opacity-90'
              }`}
            />
            <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-semibold tracking-wider uppercase text-center px-1'>
              Change Photo
            </div>
          </div>
          <span className='text-xs text-slate-400'>
            Click image to upload a new avatar (Max 2MB)
          </span>
        </div>

        {imageFileUploadError && (
          <Alert color='failure' className='rounded-xl text-xs'>
            {imageFileUploadError}
          </Alert>
        )}

        {/* Username Input */}
        <div>
          <label className='block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5'>
            Username
          </label>
          <TextInput
            type='text'
            id='username'
            placeholder='username'
            defaultValue={currentUser.username}
            onChange={handleChange}
            className='rounded-xl'
          />
        </div>

        {/* Email Input */}
        <div>
          <label className='block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5'>
            Email Address
          </label>
          <TextInput
            type='email'
            id='email'
            placeholder='email'
            defaultValue={currentUser.email}
            onChange={handleChange}
            className='rounded-xl'
          />
        </div>

        {/* Password Input */}
        <div>
          <label className='block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5'>
            New Password (Leave blank to keep unchanged)
          </label>
          <TextInput
            type='password'
            id='password'
            placeholder='••••••••'
            onChange={handleChange}
            className='rounded-xl'
          />
        </div>

        {/* Actions */}
        <div className='flex flex-col gap-3 pt-2'>
          <button
            type='submit'
            disabled={loading || imageFileUploading}
            className='w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-500/20 disabled:opacity-50 transition-all cursor-pointer'
          >
            {loading ? 'Saving Changes...' : 'Save Profile Changes'}
          </button>

          {currentUser.isAdmin && (
            <Link
              to='/create-post'
              className='w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-center text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/80 hover:bg-indigo-100 transition-colors'
            >
              + Create New Technical Article
            </Link>
          )}
        </div>
      </form>

      {/* Status Alerts */}
      {updateUserSuccess && (
        <Alert color='success' className='mt-5 rounded-xl text-xs'>
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className='mt-5 rounded-xl text-xs'>
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color='failure' className='mt-5 rounded-xl text-xs'>
          {error}
        </Alert>
      )}

      {/* Account Safety Controls */}
      <div className='mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold'>
        <button
          type='button'
          onClick={() => setShowModal(true)}
          className='text-red-500 hover:text-red-600 hover:underline transition-colors'
        >
          Delete Account
        </button>
        <button
          type='button'
          onClick={handleSignout}
          className='text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors'
        >
          Sign Out of Console →
        </button>
      </div>

      {/* Confirmation Modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center p-2'>
            <div className='w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/60 text-red-500 flex items-center justify-center mx-auto mb-4 border border-red-200 dark:border-red-900/60'>
              <HiOutlineExclamationCircle className='w-8 h-8' />
            </div>
            <h3 className='mb-2 text-lg font-bold text-slate-900 dark:text-white'>
              Delete Your Account?
            </h3>
            <p className='text-xs text-slate-500 dark:text-slate-400 mb-6'>
              This will permanently delete your user profile and privileges. This action cannot be reversed.
            </p>
            <div className='flex justify-center gap-3'>
              <Button
                color='failure'
                onClick={handleDeleteUser}
                className='rounded-xl font-semibold'
              >
                Yes, Delete Account
              </Button>
              <Button
                color='gray'
                onClick={() => setShowModal(false)}
                className='rounded-xl font-medium'
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}