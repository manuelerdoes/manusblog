import React from 'react'
import "./userinfo.css"
import { useStore } from 'zustand'
import { useUserStore } from '../../lib/userStore'
import { useContext } from 'react'
import { StoreContext } from '../../lib/store'

function Userinfo() {

  const { currentUser } = useUserStore();
  const context = useContext(StoreContext);
  const setShowUserstuff = context.setShowUserstuff;
  const showUserstuff = context.showUserstuff;

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