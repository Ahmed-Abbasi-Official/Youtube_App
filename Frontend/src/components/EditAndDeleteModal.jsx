import React, { useEffect, useState } from 'react'
import { useVideo } from '../context/Videos.Context'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UploadVideoModal from './UploadVideoModal';

const EditAndDeleteModal = ({  video , onClose }) => {
    const [show, setShow] = useState(false);
    const { deleteVideo } = useVideo();
    const navigate = useNavigate();

    // HANDLE DELETE
    const handleDelete = async () => {
        await deleteVideo.mutate(video?._id, {
            onSuccess: (data) => {
                toast.success(data?.data);
                navigate(`/`);
            },
            onError: (error) => {
                toast.error(error?.response?.data?.message);
            },
        });
    };

    const handleEdit=()=>{
        setShow(true);
        // onClose(false)
    }


    return (
        <>
            <div className="bg-black shadow-md shadow-white w-36 py-3 px-2 absolute z-20 top-10 right-0">
                <div className="flex flex-col justify-center items-center w-full gap-2">
                    <button
                        onClick={handleEdit}
                        className="bg-gray-400 md:py-2 md:px-4 py-1 sm:px-2 text-sm sm:text-md w-full text-white rounded text-center"
                    >
                        Edit
                    </button>
                    <button
                        className="bg-[#dc2525] md:py-2 md:px-4 py-1 text-sm sm:text-md w-full sm:px-2 text-white rounded"
                        onClick={handleDelete}
                    >
                        {deleteVideo?.isPending ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
            {show && (
               <UploadVideoModal
               videos={video}
               setShowUploadModal={setShow}
               />
            )}

        </>
    );
};

export default EditAndDeleteModal;
