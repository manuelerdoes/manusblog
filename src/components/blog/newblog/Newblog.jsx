import React, { useState } from 'react'
import "./newblog.css"
import { useUserStore } from '../../../lib/userStore';
import { getFormattedDateTime } from '../../../lib/utils';
import { auth, db } from '../../../lib/firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

function Newblog({ setCreateMode, topic, setTopic }) {

    const { currentUser, isLoading, fetchUserInfo } = useUserStore();
    const [loading, setLoading] = useState(false);

    const handleCancelButton = () => {
        setCreateMode(false);
    }

    const handleSaveButton = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const { title, selectedtopic, tags, content } = Object.fromEntries(formData);
        const blogid = title + "_" + getFormattedDateTime();

        try {
            await setDoc(doc(db, "blogs", blogid), {
                title,
                topic: selectedtopic,
                tags,
                userid: auth.currentUser.uid,
                created: getFormattedDateTime(),
                modified: getFormattedDateTime(),
                content,    
            });
            alert("blog saved!")
            
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
        
        // setCreateMode(false);
    }

    const handleSelection = (e) => {
        setTopic(e.target.value);
    }

    return (
        !currentUser ? (
            <div className="newblog">
                <h2>Please log in to create a new blog</h2>
            </div>
        ) : (
            <div className='newblog'>
                <form onSubmit={handleSaveButton} >
                    <div className="settitle item">
                        <label htmlFor="">Blog Title:</label>
                        <input type="text" placeholder='Blog Title' name = "title"/>
                    </div>
                    <div className="settopic item">
                        <label htmlFor="">Topic:</label>
                        <select name="selectedtopic" onChange={handleSelection}>
                            <option value="computer">Computer</option>
                            <option value="food">Food</option>
                            <option value="music">Music</option>
                            <option value="photography">Photography</option>
                            <option value="robotics">Robotics/Embedded</option>
                            <option value="travel">Travel</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div className="settags item">
                        <label htmlFor="">Tags:</label>
                        <input type="text" placeholder='Tags' name="tags" />
                    </div>
                    <div className="setcontent item">
                        <label htmlFor="">Content:</label>
                        <textarea placeholder='content' name="content"></textarea>
                    </div>
                    <div className="newblogbuttons item">
                        <div className="cancelblog">
                            <button onClick={handleCancelButton}>Cancel</button>
                        </div>
                        <div className="saveblog">
                            <button>Save</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    )
}

export default Newblog