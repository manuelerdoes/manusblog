import React from 'react'
import "./menu.css"
import { useContext } from 'react'
import { StoreContext } from '../../lib/store'

function Menu() {
  const context = useContext(StoreContext);
  const showAbout = context.showAbout;
  const setShowAbout = context.setShowAbout;
  return (
    <div className='menu'>
      <h2 onClick={() => setShowAbout(!showAbout)}>About</h2>
    </div>
  )
}

export default Menu