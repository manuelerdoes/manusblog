import React from 'react'
import "./details.css"
import { useEffect } from 'react';
import { useBlogStore } from '../../lib/blogStore';

const Details = ({ createMode }) => {

  const { currentBlog } = useBlogStore();

  return (


    !createMode ? (
      !currentBlog ? (
        <div className="details">
          <p>could not fetch data</p>
        </div>
      ) : (
        <div className='details'>
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