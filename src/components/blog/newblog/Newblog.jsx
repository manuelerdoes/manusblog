import React from 'react'
import "./newblog.css"

function Newblog({ setCreateMode }) {

    const handleCancelButton = () => {
        setCreateMode(false);
    }

    const handleSaveButton = () => {
        setCreateMode(false);
    }

    return (
        <div className='newblog'>
            <div className="settitle item">
                <label htmlFor="">Blog Title:</label>
                <input type="text" placeholder='Blog Title' />
            </div>
            <div className="settopic item">
                <label htmlFor="">Topic:</label>
                <select name="topics" id="topics">
                    <option value="photography">Photography</option>
                    <option value="music">Music</option>
                    <option value="food">Food</option>
                    <option value="computer">Computer</option>
                    <option value="robotics">Robotics/Embedded</option>
                    <option value="travel">Travel</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div className="settags item">
                <label htmlFor="">Tags:</label>
                <input type="text" placeholder='Tags'/>
            </div>
            <div className="setcontent item">
                <label htmlFor="">Content:</label>
                <textarea placeholder='content'></textarea>
            </div>
            <div className="newblogbuttons item">
                <div className="cancelblog">
                    <button onClick={handleCancelButton}>Cancel</button>
                </div>
                <div className="saveblog">
                    <button onClick={handleSaveButton}>Save</button>
                </div>
            </div>

        </div>
    )
}

export default Newblog