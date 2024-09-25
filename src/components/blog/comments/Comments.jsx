import React, { useEffect, useState } from 'react'
import "./comments.css"
import { useBlogStore } from '../../../lib/blogStore';
import { useUserStore } from '../../../lib/userStore';
import { arrayUnion, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { getFormattedDateTime } from '../../../lib/utils';
import { useRef } from 'react';

function Comments() {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const { currentUser } = useUserStore();
  const { currentBlog, fetchBlogInfo } = useBlogStore();
  const commentInputRef = useRef(null);

  const toggleComments = async () => {
    const newShowComments = !showComments;
    setShowComments(newShowComments);

    // Scroll only if the new value of showComments is true (i.e., the comments are being shown)
    if (newShowComments) {
      window.scrollTo({
        top: document.documentElement.scrollHeight, // Scroll to the bottom of the page
        behavior: 'smooth'
      });
    }
  }

  const handleNewComment = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { newcomment } = Object.fromEntries(formData);

    if (!newcomment || !currentBlog?.id || !currentUser?.id) {
      console.log("Missing necessary data to submit the comment.");
      return;
    }

    try {
      await updateDoc(doc(db, "blogs", currentBlog.id), {
        comments: arrayUnion({
          userid: currentUser.id,
          username: currentUser.username,
          text: newcomment,
          createdAt: getFormattedDateTime(),
        }),
      });

      setCommentText("");
      console.log("Comment added successfully!");
    } catch (error) {
      console.log(error.message);
    }
  };



  return (
    !currentBlog.disableComments ? (
    <div className='comments'>
      <div className="commentsheader" onClick={toggleComments}>
        <h2>Comments</h2>
        <span onClick={toggleComments}>👁️</span>
      </div>
      {showComments && (
        <div className="allcomments">
          {!currentBlog.comments ? (
            <div className="commentcontainer">
              <h3>no comments</h3>
            </div>
          ) : (
            currentBlog?.comments.map((comment) => (
              <div className="commentcontainer">
                <div className="commentuser">
                  <h3>{comment?.username}</h3>
                </div>
                <div className="commentcontent">
                  <p>{comment?.text}</p>
                </div>
              </div>
            ))
          )
          }
          <div className="newcomment">
            <form onSubmit={handleNewComment}>
              <div className="texti">
                {/* <input type="text" placeholder='Comment' name='newcomment' /> */}
                <textarea name='newcomment' id='newcomment' 
                value={commentText} onChange={(e) => setCommentText(e.target.value)}></textarea>
              </div>
              <div className="boetton">
                <button>Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    ) : (
      <div className="comments">
        <p>comments disabled</p>
      </div>
    )
  )
}

export default Comments