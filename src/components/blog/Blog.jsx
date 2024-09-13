import React, { useEffect, useState } from 'react'
import "./blog.css"
import Comments from './comments/Comments'
import Newblog from './newblog/Newblog'
import { useBlogStore } from '../../lib/blogStore';



const Blog = ({ createMode, setCreateMode, setTopic, topic, 
  setCurrentBlogId, newBlogContent, 
  setNewBlogContent, newBlogTitle, setNewBlogTitle, newBlogTags, setNewBlogTags}) => {


  const { currentBlog } = useBlogStore();

  return (
    !createMode ? (
      !currentBlog ? (
        <div className="blog">
          <div className="blogtitle">
            Could not fetch blog
          </div>
        </div>
      ) : (
        <div className='blog'>
          <div className="blogtitle">
            <h2>{currentBlog.title}</h2>
          </div>
          <div className="blogcontent">
            <p>
              {currentBlog.content}
            </p>
          </div>
          <Comments />
        </div>
      )
    ) : (
      <Newblog setCreateMode={setCreateMode} topic={topic} 
      setTopic={setTopic} setCurrentBlogId={setCurrentBlogId}
      newBlogTitle={newBlogTitle} setNewBlogTitle={setNewBlogTitle}
      newBlogTags={newBlogTags} setNewBlogTags={setNewBlogTags}
      newBlogContent={newBlogContent} setNewBlogContent={setNewBlogContent}/>
    )
  )
}

export default Blog