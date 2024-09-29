import React, { useState, useContext } from 'react'
import "./details.css"
import { useEffect } from 'react';
import { useBlogStore } from '../../lib/blogStore';
import { useUserStore } from '../../lib/userStore';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { useBlogListStore } from '../../lib/blogListStore';
import UploadPictures from './uploadpictures/UploadPictures';
import { StoreContext } from '../../lib/store';


const Details = () => {

  const context = useContext(StoreContext);
  const { currentBlog } = useBlogStore();
  const { currentUser } = useUserStore();
  const { currentBlogList, fetchBlogListInfo } = useBlogListStore();
  const [showEditButton, setShowEditButton] = useState(false);
  const [showUploadPics, setShowUploadPics] = useState(false);
  const [pictureList, setPictureList] = useState([]);
  const setNewBlogTitle = context.setNewBlogTitle;
  const createMode = context.createMode;
  const setCreateMode = context.setCreateMode;
  const setNewBlogTags = context.setNewBlogTags;
  const setNewBlogContent = context.setNewBlogContent;
  const setEditMode = context.setEditMode;
  const setCurrentBlogId = context.setCurrentBlogId;
  const setNewDisableComments = context.setNewDisableComments;
  const setNewBlogPublic = context.setNewBlogPublic;
  const allowed = context.allowed;
  const [author, setAuthor] = useState(null);



  useEffect(() => {
    if (currentUser?.id === currentBlog?.userid || currentUser?.id === "2XKfBCU9BYWK05cYCRdzVxAzRfZ2" /* Admin */) {
      setShowEditButton(true);
      setShowUploadPics(true);
    } else {
      setShowEditButton(false);
      setCreateMode(false);
      setShowUploadPics(false);
    }
  }, [currentUser, currentBlog]);

  useEffect(() => {
    if (currentBlog && currentBlog.userid) {
      const fetchAuthorData = async () => {
        try {
          const authorRef = doc(db, 'users', currentBlog.userid);
          const authorDoc = await getDoc(authorRef);
          if (authorDoc.exists()) {
            setAuthor(authorDoc.data());
          }
        } catch (error) {
          console.error("Error fetching author data: ", error);
        }
      };

      fetchAuthorData();
    }
  }, [currentBlog]);

  const handleClickEditButton = () => {
    setCreateMode(true);
    setNewBlogTitle(currentBlog?.title);
    setNewBlogTags(currentBlog?.tags);
    setNewBlogContent(currentBlog?.content);
    setNewBlogPublic(currentBlog?.isPublic);
    setNewDisableComments(currentBlog?.disableComments);
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

  const handlePictureUpload = (e) => {
    const files = e.target.files;
  }

  return (
    !createMode ? (
      !currentBlog ? (
        <div className="details">
          <p>no data</p>
        </div>
      ) : (
        allowed ? (
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
            <div className="author item">
              <h3>created by</h3>
              <div className="authorinfo">
                <div className="authorimage">
                  <img src={author ? author.avatar || "./avatar.png" : "./avatar.png"} alt="" />
                </div>
                <div className="username">
                  {currentBlog.username}
                </div>
              </div>
            </div>
            <div className="topic item">
              <h3>topic</h3>
              <div className="topico">
                <p className={currentBlog.topic}>{currentBlog.topic}</p>
              </div>
            </div>
            <div className="tags item">
              <h3>tags</h3>
              <p>{currentBlog.tags}</p>
            </div>
            <div className="timestamps item">
              <h3>created on</h3>
              <p>{currentBlog.created}</p>
              <h3>last modified</h3>
              <p>{currentBlog.modified}</p>
            </div>
          </div>
        ) : (
          <div className="details">
            <p>Access Denied</p>
          </div>
        )
      )
    ) : (
      <div className="details">
        {(showUploadPics && (
          <UploadPictures />
        ))}
      </div>
    )
  )
}

export default Details