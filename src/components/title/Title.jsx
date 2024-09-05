import React from 'react'
import "./title.css"

function Title() {
  const handleReload = () => {
    window.location.reload();
  }

  return (
    <div className='title'>
      <h2 onClick={handleReload}>Manus Blog</h2>
    </div>
  )
}

export default Title