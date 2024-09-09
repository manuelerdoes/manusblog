import React from 'react'
import "./userinfo.css"
import { useStore } from 'zustand'
import { useUserStore } from '../../lib/userStore'

function Userinfo({showUserstuff, setShowUserstuff}) {

  const { currentUser } = useUserStore();

  return (
    <div className='userinfo'>
      <div className='user' onClick={() => setShowUserstuff(!showUserstuff)}>
        <img src={currentUser ? currentUser.avatar || "./avatar.png" : "./avatar.png"} alt="" />
        <h2>{currentUser ? currentUser.username : "Login"}</h2>
      </div>
    </div>
  )
}

export default Userinfo