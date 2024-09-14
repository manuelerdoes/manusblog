import React from 'react'
import "./list.css"
import Bloglist from './bloglist/Bloglist'

function List({setCurrentBlogId}) {
  return (
    <div className='list'>
        <Bloglist setCurrentBlogId={setCurrentBlogId}/>
    </div>
  )
}

export default List