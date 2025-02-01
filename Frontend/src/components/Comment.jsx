import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useComments } from "../context/Comment.Context";
import { useUser } from "../context/User.Context";
import { format } from "timeago.js";
import { toast } from "react-toastify";
import millify from "millify";
import { IoMdThumbsUp } from "react-icons/io";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Comment({ video }) {
  const { user, userLoading } = useUser();
  const { getComments, likeComment, deleteComment } = useComments();
  const [showPopUp, seShowPopUp] = useState(false);
  const [showPopUpId, setShowPopUpId] = useState(null);
  const navigate=useNavigate();

  // GET ALL COMMENTS

  const {
    data: commentData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["comments"],
    queryFn: async () => {
      return await getComments(video?._id);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // HANDLE LIKED COMMENT

  const handleLikedComment = async (commentId) => {
    await likeComment.mutate(commentId, {
      onSuccess: (updatedComment) => {
        if (updatedComment?.data === "Comment liked successfully") {
          toast.success(updatedComment?.data);
        } else {
          toast.success(updatedComment?.data);
        }
      },
      onError: (error) => {
        console.error("Error:", error);
        toast.error(error?.response?.data?.message);
      },
    });
  };

  // UPDATE COMMENT

  const handleUpdateComment = async (commentId) => {};

  // DELETE COMMENT

  const handleDeleteComment = async (commentId) => {
    await deleteComment.mutate(commentId, {
      onSuccess: (updatedComment) => {
        toast.success(updatedComment?.data);
      },
      onError: (error) => {
        console.error("Error:", error);
        toast.error(error?.response?.data?.message);
      },
    });
  };

  console.log(commentData)


  return (
    <div className="w-full pt-2  bg-[#000] min-h-screen">
      {commentData?.message?.map((comment) => (
        <div key={comment._id} className="mb-4">
          <div className="flex gap-4">
            {/* USER IMAGE */}

            <div className="h-10 w-10">
              <img
              onClick={() => {
                navigate(`/${comment?.user?.username}`)
              }}
                src={comment?.user?.avatar || "/placeholder.svg"}
                alt={comment?.user?.username}
                className="rounded-full w-full cursor-pointer h-full object-cover"
              />
            </div>
            <div className="flex-1">
              {/* USER INFO */}

              <div className="flex items-center gap-2">
                <span 
                onClick={() => {
                  navigate(`/${comment?.user?.username}`)
                }}
                className="text-sm font-medium cursor-pointer text-white">
                  {comment?.user?.username || comment.author}
                </span>
                <span className="text-xs text-gray-400">
                  {format(comment?.createdAt) || comment.time}
                </span>
              </div>

              {/* COMMENT PINNED */}

              {comment.isPinned && (
                <div className="text-xs text-gray-400 mb-1">Pinned</div>
              )}

              {/* COMMENT */}

              <p className="text-white mt-1">
                {comment?.comment || comment.content}
              </p>

              {/* LIKES AND REPLIES */}

              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={() => handleLikedComment(comment?._id)}
                  className="text-gray-400 hover:text-gray-300 flex items-center text-sm"
                >
                  {comment?.likes?.includes(user?.message?._id) ? (
                    <IoMdThumbsUp className="h-5 w-5 mr-2 " />
                  ) : (
                    <svg
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                    </svg>
                  )}
                  {millify(comment?.likes?.length)}
                </button>
                <button className="text-gray-400 hover:text-gray-300 text-sm">
                  Reply
                </button>
              </div>

              {/* COMMENT REPLIES */}

              {comment.replies && (
                <button className="text-blue-500 hover:text-blue-400 mt-2 flex items-center text-sm">
                  <svg
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                  {comment.replies} replies
                </button>
              )}
            </div>

            {/* THREE DOTS */}

            <button
              onClick={() =>
                setShowPopUpId((prev) =>
                  prev === comment._id ? null : comment._id
                )
              }
              className="text-gray-400 hover:text-gray-300 relative"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
              {showPopUpId === comment._id && (
                <div className="bg-black shadow-md shadow-white w-36 py-3 px-2 absolute z-20 top-14 right-0">
                  <div className="flex flex-col justify-center items-center w-full gap-2">
                    {/* <button
                      onClick={() => handleUpdateComment(comment._id)}
                      className="bg-gray-400 md:py-2 md:px-4 py-1 sm:px-2 text-sm sm:text-md w-full text-white rounded text-center"
                    >
                      Edit
                    </button> */}
                    <button
                      className="bg-[#dc2525] md:py-2 md:px-4 py-1 text-sm sm:text-md w-full sm:px-2 text-white rounded"
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
