import React from 'react'
import "./details.css"
import { useEffect } from 'react';

const Details = ({topic, setTopic}) => {

  useEffect(() => {
    // Simulate fetching the topic
    const fetchedTopic = "ttuzfgzu"; // Assume this is fetched

    // Set the topic after fetching
    setTopic(fetchedTopic);
  }, [setTopic]); // Dependency array ensures this runs only once when the component mounts

  return (

    <div className='details'>
      <div className="author">
        <p>created by: Maneul</p>
      </div>
      <div className="timestamps">
        <p>created on: 21.3.2024</p>
        <p>last modified: 12.6.2024</p>
      </div>
      <div className="{topic}">
        <p>topic: {topic}</p>
      </div>
    </div>
  )
}

export default Details