import React from 'react';
import "./list.css";
import Bloglist from './bloglist/Bloglist';
import { useNavigate } from 'react-router-dom';

function List() {
  const navigate = useNavigate();

  const handleBlogClick = (blogId) => {
    // Navigate to the blog's page with the corresponding blogId
    navigate(`/${blogId}`);
  };

  return (
    <div className='list'>
      {/* Pass handleBlogClick to Bloglist so it can be used in Blog items */}
      <Bloglist onBlogClick={handleBlogClick} />
    </div>
  );
}

export default List;