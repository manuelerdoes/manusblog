import React, { useState, useEffect } from 'react'
import "./newblog.css"
import { useUserStore } from '../../../lib/userStore';
import { getFormattedDateTime } from '../../../lib/utils';
import { auth, db } from '../../../lib/firebase';
import { deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { useBlogStore } from '../../../lib/blogStore';

function Newblog({ setCreateMode, setTopic, topic, setCurrentBlogId, newBlogContent,
    setNewBlogContent, newBlogTitle, setNewBlogTitle, newBlogTags, setNewBlogTags, editMode,
    setEditMode }) {


    const { currentBlog } = useBlogStore();
    const { currentUser } = useUserStore();
    const [loading, setLoading] = useState(false);
    const [blogId, setBlogId] = useState(null); // Hold blogId as state

    // Create an empty blog document as soon as the component loads (for new blogs only)
    useEffect(() => {
        if (!editMode && currentUser) {
            const newBlogId = `${currentUser.username}_${getFormattedDateTime()}`;
            setBlogId(newBlogId); // Save blogId to state

            // Create an empty blog document
            setDoc(doc(db, "blogs", newBlogId), {
                id: newBlogId,
                userid: auth.currentUser.uid,
                username: currentUser.username,
                created: getFormattedDateTime(),
                modified: getFormattedDateTime(),
                title: "New Blog", // Initially empty
                content: "", // Initially empty
                tags: "",
                topic: topic || "other", // Default topic
            }).then(() => {
                setCurrentBlogId(newBlogId); // Set blogId globally
            }).catch((error) => {
                console.log("Error creating initial blog document: ", error);
            });
        }
    }, [editMode, setCurrentBlogId]);

    const handleCancelButton = async () => {
        setCreateMode(false);
        setNewBlogContent("");
        setNewBlogTitle("");
        setNewBlogTags("");

        // Optionally delete the empty blog document if blog creation is cancelled
        if (blogId) {
            await deleteDoc(doc(db, "blogs", blogId));
        }
    };

    const handleSaveButton = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const { title, selectedtopic, tags, rawcontent } = Object.fromEntries(formData);
        const content = rawcontent;

        try {
            if (!editMode) {
                // Update the initially created document with the final content
                await updateDoc(doc(db, "blogs", blogId), {
                    title,
                    topic: selectedtopic,
                    tags,
                    content,
                    modified: getFormattedDateTime(),
                });
                setNewBlogContent("");
                setNewBlogTitle("");
                setNewBlogTags("");
            } else {
                // For editing mode, update the existing blog
                await updateDoc(doc(db, "blogs", currentBlog.id), {
                    title,
                    topic: selectedtopic,
                    tags,
                    content,
                    modified: getFormattedDateTime(),
                });
                setEditMode(false);
            }

            setTopic(selectedtopic);
            setCurrentBlogId(currentBlog.id);
            setCreateMode(false);

        } catch (error) {
            console.log("Error saving the blog:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelection = (e) => {
        setTopic(e.target.value);
    };

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
                    {/* <div className="disableComments item">
                        <label htmlFor="disableComments" className='dcomLabel'>Disable Comments:
                            <input type="checkbox" id="disableComments" name="disableComments" value="true" />
                            <span class="checkmark"></span>
                        </label>
                    </div> */}
                    <div className="setcontent item">
                        <label htmlFor="">Content:</label>
                        <textarea placeholder='Lorem ipsum, dolor sit amet' name="rawcontent" value={newBlogContent}
                            onChange={(e) => setNewBlogContent(e.target.value)} required></textarea>
                    </div>
                    <div className="newblogbuttons item">
                        <div className="cancelblog">
                            <button type="button" onClick={handleCancelButton}>Cancel</button>
                        </div>
                        <div className="saveblog">
                            <button type="submit">Save</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    );
}

export default Newblog;