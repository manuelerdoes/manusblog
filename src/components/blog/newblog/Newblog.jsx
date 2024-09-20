import React, { useState } from 'react'
import "./newblog.css"
import { useUserStore } from '../../../lib/userStore';
import { getFormattedDateTime } from '../../../lib/utils';
import { auth, db } from '../../../lib/firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { useBlogStore } from '../../../lib/blogStore';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

function Newblog({ setCreateMode, setTopic, topic, setCurrentBlogId, newBlogContent,
    setNewBlogContent, newBlogTitle, setNewBlogTitle, newBlogTags, setNewBlogTags, editMode,
    setEditMode }) {

    const { currentUser } = useUserStore();
    const { currentBlog } = useBlogStore();
    const [loading, setLoading] = useState(false);



    const handleCancelButton = () => {
        setCreateMode(false);
        setNewBlogContent("");
        setNewBlogTitle("");
        setNewBlogTags("");
        // setTopic("other");
    }

    const handleSaveButton = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const { title, selectedtopic, tags, rawcontent } = Object.fromEntries(formData);
        const blogid = title + "_" + getFormattedDateTime();
        const content = rawcontent;

        try {

            if (!editMode) {
                console.log("setdoc")
                await setDoc(doc(db, "blogs", blogid), {
                    id: blogid,
                    title,
                    topic: selectedtopic,
                    tags,
                    userid: auth.currentUser.uid,
                    username: currentUser.username,
                    created: getFormattedDateTime(),
                    modified: getFormattedDateTime(),
                    content,
                });
                setCurrentBlogId(blogid);
                setNewBlogContent("");
                setNewBlogTitle("");
                setNewBlogTags("");
            } else {
                console.log("updatedoc")
                await updateDoc(doc(db, "blogs", currentBlog.id), {
                    title,
                    topic: selectedtopic,
                    tags,
                    userid: auth.currentUser.uid,
                    username: currentUser.username,
                    created: getFormattedDateTime(),
                    modified: getFormattedDateTime(),
                    content,
                });
                setCurrentBlogId(currentBlog.id);
                setEditMode(false);
            }

            // alert("blog saved!")
            setTopic(selectedtopic);
            // setCurrentBlogId(blogid);
            setCreateMode(false);

        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
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
                        <input type="text" placeholder='Blog Title'
                            name="title" value={newBlogTitle}
                            onChange={(e) => setNewBlogTitle(e.target.value)}
                            required />
                    </div>
                    <div className="settopic item">
                        <label htmlFor="">Topic:</label>
                        <select name="selectedtopic" value={topic}
                            onChange={handleSelection}>
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
                        <input type="text" placeholder='Tags' name="tags"
                            value={newBlogTags} onChange={(e) => setNewBlogTags(e.target.value)} />
                    </div>
                    <div className="setcontent item">
                        <label htmlFor="">Content:</label>
                        <textarea placeholder='content' name="rawcontent" value={newBlogContent}
                            onChange={(e) => setNewBlogContent(e.target.value)} required></textarea>
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