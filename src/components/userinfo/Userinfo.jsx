import React from 'react'
import "./userinfo.css"

function Userinfo({showUserstuff, setShowUserstuff}) {
  return (
    <div className='userinfo'>
      <div className='user' onClick={() => setShowUserstuff(!showUserstuff)}>
        <img src="./avatar.png" alt="" />
        <h2>Max Muster</h2>
      </div>
    </div>
  )
}

export default Userinfo