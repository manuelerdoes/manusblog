import React from 'react'
import "./details.css"
import { useEffect } from 'react';

const Details = ({topic, setTopic}) => {

  useEffect(() => {
    // Simulate fetching the topic
    const fetchedTopic = "computersdf"; // Assume this is fetched

    // Set the topic after fetching
    setTopic(fetchedTopic);
  }, [setTopic]); // Dependency array ensures this runs only once when the component mounts

  return (

    <div className='details'>
      <div className="author">
        <h3>created by</h3>
        <p>Maneul</p>
      </div>
      <div className="timestamps">
        <h3>created on</h3>
        <p>21.3.2024</p>
        <h3>last modified</h3>
        <p>12.6.2024</p>
      </div>
      <div className="{topic}">
        <h3>topic</h3>
        <p>{topic}</p>
      </div>
    </div>
  )
}

export default Details