import React from 'react'
import "./menu.css"

function Menu({showAbout, setShowAbout}) {
  return (
    <div className='menu'>
      <h2 onClick={() => setShowAbout(!showAbout)}>About</h2>
    </div>
  )
}

export default Menu