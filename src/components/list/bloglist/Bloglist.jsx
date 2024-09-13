import React, { useState } from 'react'
import "./bloglist.css"
import { useEffect, useRef } from 'react';
import { useBlogListStore } from '../../../lib/blogListStore';

function Bloglist() {
  const searchInputRef = useRef(null);
  const [showTopicFilter, setShowTopicFilter] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);

  const { currentBlogList, fetchBlogListInfo } = useBlogListStore();

  // Handle the keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault(); // Prevent the default action (such as browser search)
        if (searchInputRef.current) {
          searchInputRef.current.focus(); // Focus on the search input
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (searchActive) {
      setShowTopicFilter(true);
      return;
    } else if (showTopicFilter && isMouseOver) {
      return;
    }
    setShowTopicFilter(false);

  }, [isMouseOver, searchActive]);

  const getAllBlogs = async () => {
    const querySnapshot = await getDocs(collection(db, "blogs"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());

    });
  }



  return (
    <div className='bloglist' onMouseOver={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}>
      <div className="search">
        <div className="searchbar">
          <img src="./search.png" alt="" />
          <input ref={searchInputRef} type="text" placeholder='Search: CMD/CTRL + K'
            onFocus={() => setSearchActive(true)} onBlur={() => setSearchActive(false)} />
        </div>
      </div>
      {showTopicFilter && (
        <div className="topicfilter">
          <h3>filter:</h3>
          <div className="topic phototopic"><span>📸 photography</span></div>
          <div className="topic musictopic"><span>🎵 music</span></div>
          <div className="topic computertopic"><span>💻 computer</span></div>
          <div className="topic foodtopic"><span>🍕 food</span></div>
          <div className="topic roboticstopic"><span>🤖 robotics/embedded</span></div>
          <div className="topic traveltopic"><span>🚀 travel</span></div>
          <div className="topic othertopic"><span>⭐️ other</span></div>
        </div>
      )}
      <div className="item">
        <p>{currentBlogList}</p>
      </div>

    </div>
  )
}

export default Bloglist