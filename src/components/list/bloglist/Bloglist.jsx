import React from 'react'
import "./bloglist.css"

function Bloglist() {
  return (
    <div className='bloglist'>
      <div className="search">
        <div className="searchbar">
          <img src="./search.png" alt="" />
          <input type="text" placeholder='Search' />
        </div>
      </div>
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