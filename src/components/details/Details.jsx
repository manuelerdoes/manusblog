import React, { useState } from 'react'
import "./details.css"
import { useEffect } from 'react';
import { useBlogStore } from '../../lib/blogStore';
import { useUserStore } from '../../lib/userStore';
import { deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { useBlogListStore } from '../../lib/blogListStore';

const Details = ({ createMode, setCreateMode, setNewBlogTitle,
  setNewBlogTags, setNewBlogContent, setEditMode, setCurrentBlogId }) => {

  const { currentBlog } = useBlogStore();
  const { currentUser } = useUserStore();
  const { currentBlogList, fetchBlogListInfo } = useBlogListStore();
  const [showEditButton, setShowEditButton] = useState(false);

  useEffect(() => {
    if (currentUser?.id === currentBlog?.userid) {
      setShowEditButton(true);
    } else {
      setShowEditButton(false);
      setCreateMode(false);
    }
  }, [currentUser, currentBlog]);

  const handleClickEditButton = () => {
    setCreateMode(true);
    setNewBlogTitle(currentBlog?.title);
    setNewBlogTags(currentBlog?.tags);
    setNewBlogContent(currentBlog?.content);
    setEditMode(true);
  }

  const handleClickDeleteButton = async () => {
    try {
      if (currentBlog.id === currentBlogList[0]?.id) {
        setCurrentBlogId(currentBlogList[1]?.id);
      } else {
        setCurrentBlogId(currentBlogList[0]?.id);
      }
    
      await deleteDoc(doc(db, "blogs", currentBlog.id));
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    !createMode ? (
      !currentBlog ? (
        <div className="details">
          <p>no data</p>
        </div>
      ) : (
        <div className='details'>
          {showEditButton && (
            <div className="manageButtons">
              <div className="editButton">
                <button onClick={handleClickEditButton}>Edit Blog</button>
              </div>
              <div className="deleteButton">
                <button onClick={handleClickDeleteButton}>Delete Blog</button>
              </div>
            </div>
          )}
          <div className="author">
            <h3>created by</h3>
            <p>{currentBlog.username}</p>
          </div>
          <div className="timestamps">
            <h3>created on</h3>
            <p>{currentBlog.created}</p>
            <h3>last modified</h3>
            <p>{currentBlog.modified}</p>
          </div>
          <div className="{topic}">
            <h3>topic</h3>
            <p>{currentBlog.topic}</p>
          </div>
        </div>
      )
    ) : (
      <div className="details">
        <h3>new blog</h3>
      </div>
    )
  )
}

export default Details