import React, { useEffect } from 'react';
import "./blog.css";
import Comments from './comments/Comments';
import Newblog from './newblog/Newblog';
import { useBlogStore } from '../../lib/blogStore';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { useParams, useNavigate } from 'react-router-dom';

const Blog = ({ 
  createMode, setCreateMode, setTopic, topic,
  setCurrentBlogId, newBlogContent, setNewBlogContent,
  newBlogTitle, setNewBlogTitle, newBlogTags, setNewBlogTags,
  editMode, setEditMode 
}) => {
  const { currentBlog, fetchBlogInfo } = useBlogStore();
  const { blogId } = useParams(); // Get blogId from URL
  const navigate = useNavigate();

  // Fetch blog info whenever the blogId from the URL changes
  useEffect(() => {
    if (blogId) {
      setCurrentBlogId(blogId); // Set the current blog ID to the one from the URL
      fetchBlogInfo(blogId); // Fetch blog details
    }
  }, [blogId, setCurrentBlogId, fetchBlogInfo]);

  return (
    !createMode ? (
      !currentBlog ? (
        <div className="blog">
          <div className="blogtitle">
            <p>loading...</p>
          </div>
        </div>
      ) : (
        <div className='blog'>
          <div className="blogtitle">
            <h2>{currentBlog.title}</h2>
          </div>
          <div className="blogcontent">
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(currentBlog.content)) }} />
          </div>
          <Comments />
        </div>
      )
    ) : (
      <Newblog 
        setCreateMode={setCreateMode} 
        topic={topic}
        setTopic={setTopic} 
        setCurrentBlogId={setCurrentBlogId}
        newBlogTitle={newBlogTitle} 
        setNewBlogTitle={setNewBlogTitle}
        newBlogTags={newBlogTags} 
        setNewBlogTags={setNewBlogTags}
        newBlogContent={newBlogContent} 
        setNewBlogContent={setNewBlogContent}
        editMode={editMode} 
        setEditMode={setEditMode} 
      />
    )
  );
};

export default Blog;