import React, { useEffect, useState } from 'react'
import "./comments.css"

function Comments() {
  const [showComments, setShowComments] = useState(true);

  const toggleComments = () => {
    const newShowComments = !showComments; // Calculate the new value of showComments
    setShowComments(newShowComments); // Update the state

    // Scroll only if the new value of showComments is true (i.e., the comments are being shown)
    if (newShowComments) {
      window.scrollTo({
        top: document.documentElement.scrollHeight, // Scroll to the bottom of the page
        behavior: 'smooth' 
      });
    }
  }

  return (
    <div className='comments'>
      <div className="commentsheader">
        <h2>Comments</h2>
        <span onClick={toggleComments}>show/hide comments</span>
      </div>
      {showComments && (
        <div className="allcomments">
          <div className="commentcontainer">
            <div className="commentuser">
              <h3>Ueli</h3>
            </div>
            <div className="commentcontent">
              <p>Dieser Blog ist scheisse. Alles die Schuld der Ausländer. Und der Cüpli-Sozis.
                Ich suche mir einen guten Schweizer blog, falls es das noch gibt.</p>
            </div>
          </div>
          <div className="commentcontainer">
            <div className="commentuser">
              <h3>Ruedi</h3>
            </div>
            <div className="commentcontent">
              <p>Finde ich auch. Nicht mal mehr Deutsch könen die. ich weis auch nicht was das für
                eine tubel-sprahce ist hier.
              </p>
            </div>
          </div>
          <div className="commentcontainer">
            <div className="commentuser">
              <h3>HP Meier</h3>
            </div>
            <div className="commentcontent">
              <p>
                Saupack!
              </p>
            </div>
          </div>
          <div className="newcomment">
            <input type="text" placeholder='Comment' name='newcomment' />
            <button>Submit</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Comments