import React, { useState } from 'react'
import "./bloglist.css"
import { useEffect, useRef } from 'react';

function Bloglist() {
  const searchInputRef = useRef(null);
  const [showTopicFilter, setShowTopicFilter] = useState(false);
  const [filterUsed, setFilterUsed] = useState(false);

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

  const handleSearchBarBlur = () => {
    if (!filterUsed) {
      setShowTopicFilter(false);
    }
  }

  const handleTopicFilterBlur = () => {
    setFilterUsed(false);
    handleSearchBarBlur;
  }

  return (
    <div className='bloglist'>
      <div className="search">
        <div className="searchbar">
          <img src="./search.png" alt="" />
          <input ref={searchInputRef} type="text" placeholder='Search: CMD/CTRL + K'
            onFocus={() => setShowTopicFilter(true)}
            onBlur={handleSearchBarBlur} />
        </div>
      </div>
      {showTopicFilter && (
        <div className="topicfilter" onMouseOver={() => setFilterUsed(true)} 
          onClick={() => setFilterUsed(true)} onFocus={() => setFilterUsed(true)} 
          onBlur={handleTopicFilterBlur} onMouseLeave={handleTopicFilterBlur}>
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
        <p>📸</p>
        <p>Beispielblogtitel</p>
      </div>
      <div className="item">
        <p>🍖</p>
        <p>Beispielblogtitel</p>
      </div>
      <div className="item">
        <p>💻</p>
        <p>Beispielblogtitel</p>
      </div>
      <div className="item">
        <p>🤖</p>
        <p>Beispielblogtitel</p>
      </div>
      <div className="item">
        <p>🥗</p>
        <p>Beispielblogtitel</p>
      </div>

    </div>
  )
}

export default Bloglist