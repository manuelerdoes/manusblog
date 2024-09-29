import React, { useEffect, useContext, useState } from 'react';
import "./blog.css";
import Comments from './comments/Comments';
import Newblog from './newblog/Newblog';
import { useBlogStore } from '../../lib/blogStore';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { useParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../lib/store';
import { auth } from '../../lib/firebase';

const Blog = () => {
  const { currentBlog, fetchBlogInfo } = useBlogStore();
  const { blogId } = useParams(); // Get blogId from URL
  const navigate = useNavigate();
  const context = useContext(StoreContext);
  const createMode = context.createMode;
  const setCurrentBlogId = context.setCurrentBlogId;
  const allowed = context.allowed;
  const setAllowed = context.setAllowed;
  const currentBlogId = context.currentBlogId;

  // Fetch blog info whenever the blogId from the URL changes
  useEffect(() => {
    if (blogId) {
      if (currentBlog.isPublic || (auth.currentUser && currentBlog.userid === auth.currentUser.uid)) {
        setAllowed(true);
      } else {
        setAllowed(false);  
      }
      setCurrentBlogId(blogId); // Set the current blog ID to the one from the URL
      fetchBlogInfo(blogId); // Fetch blog details
    }
  }, [blogId, setCurrentBlogId, fetchBlogInfo, currentBlogId]);

  return (
    !createMode ? (
      !currentBlog ? (
        <div className="blog">
          <div className="blogtitle">
            <p>loading...</p>
          </div>
        </div>
      ) : (
        allowed ? (
        <div className='blog'>
          <div className="blogtitle">
            <h2>{currentBlog.title}</h2>
          </div>
          <div className="blogcontent">
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(currentBlog.content)) }} />
          </div>
          <Comments />
        </div>
        ) : (
          <div className="blog">
            <div className="blogtitle">
              <h2>Access Denied</h2>
            </div>
          </div>
        )
      )
    ) : (
      <Newblog />
    )
  );
};

export default Blog;