import React, { useState, useEffect, useContext } from 'react'
import "./newblog.css"
import { useUserStore } from '../../../lib/userStore';
import { getFormattedDateTime, getEpoch, updatePictureBlogIds } from '../../../lib/utils';
import { auth, db } from '../../../lib/firebase';
import { deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { useBlogStore } from '../../../lib/blogStore';
import { StoreContext } from '../../../lib/store';


function Newblog() {

    const { currentBlog } = useBlogStore();
    const { currentUser } = useUserStore();
    const context = useContext(StoreContext);
    const setCurrentBlogId = context.setCurrentBlogId;
    const [loading, setLoading] = useState(false);
    const temporaryBlogId = context.temporaryBlogId;
    const setTemporaryBlogId = context.setTemporaryBlogId;
    const createMode = context.createMode;
    const setCreateMode = context.setCreateMode;
    const editMode = context.editMode;
    const setEditMode = context.setEditMode;
    const newBlogTitle = context.newBlogTitle;
    const setNewBlogTitle = context.setNewBlogTitle;
    const newBlogTags = context.newBlogTags;
    const setNewBlogTags = context.setNewBlogTags;
    const newBlogContent = context.newBlogContent;
    const setNewBlogContent = context.setNewBlogContent;
    const topic = context.topic;
    const setTopic = context.setTopic;
    const newBlogPublic = context.newBlogPublic;
    const setNewBlogPublic = context.setNewBlogPublic;
    const newDisableComments = context.newDisableComments;
    const setNewDisableComments = context.setNewDisableComments;
    const setServerImages = context.setServerImages;

    useEffect(() => {
        if (createMode && !editMode && currentUser) {
            const newBlogId = `${currentUser.username}_${getEpoch()}`;
            setTemporaryBlogId(newBlogId);
        } else if (createMode && editMode && currentUser) {
            setTemporaryBlogId(currentBlog?.id); // to make uploadpictures work
        }
    }, [createMode, editMode]);

    const handleCancelButton = async () => {
        setCreateMode(false);
        setNewBlogContent("");
        setNewBlogTitle("");
        setNewBlogTags("");
        setServerImages([]);
        setTemporaryBlogId(null);
        setNewBlogPublic(false);
        setNewDisableComments(false);
    };

    const handleSaveButton = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const { title, selectedtopic, tags, rawcontent } = Object.fromEntries(formData);
        const content = rawcontent;

        try {
            if (!editMode) {
                const newBlogId = `${currentUser.username}_${title}_${getEpoch().toString().slice(-3)}`;
                
                setDoc(doc(db, "blogs", newBlogId), {
                    id: newBlogId,
                    userid: auth.currentUser.uid,
                    title,
                    username: currentUser.username,
                    created: getFormattedDateTime(),
                    modified: getFormattedDateTime(),
                    content,
                    tags,
                    topic: selectedtopic,
                    isPublic: newBlogPublic,
                    disableComments: newDisableComments,
                }).then(() => {
                    updatePictureBlogIds(temporaryBlogId, newBlogId);
                    setCurrentBlogId(newBlogId);
                }).catch((error) => {
                    console.log("Error creating initial blog document: ", error);
                });
                // setBlogId(newBlogId); // Save blogId to state
                setNewBlogContent("");
                setNewBlogTitle("");
                setNewBlogTags("");
            } else {
                // For editing mode, update the existing blog
                // const newBlogId = `${currentUser.username}_${title}_${getEpoch()}`;
                await updateDoc(doc(db, "blogs", currentBlog.id), {
                    // id: newBlogId,
                    title,
                    topic: selectedtopic,
                    tags,
                    content,
                    modified: getFormattedDateTime(),
                    isPublic: newBlogPublic,
                    disableComments: newDisableComments,
                });
                setEditMode(false);
            }
            setServerImages([]);
            setTemporaryBlogId(null);
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

    const handlePublicButton = (e) => {
        setNewBlogPublic(!newBlogPublic);
    }

    const handleCommentButton = (e) => {
        setNewDisableComments(!newDisableComments);
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
                    <div className="setoptions item">
                        <label htmlFor="">Options:</label>
                        <div className="optionsbuttons">
                            <button type="button" className={`${newBlogPublic ? 'publicblog' : ''}`}
                                onClick={handlePublicButton}>blog public: {String(newBlogPublic)}</button>
                            <button type="button" className={`${newDisableComments ? 'disablecomments' : ''}`}
                                onClick={handleCommentButton}>disable comments: {String(newDisableComments)}</button>
                        </div>
                    </div>
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