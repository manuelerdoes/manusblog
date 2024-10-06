import List from "./components/list/List";
import Blog from "./components/blog/Blog";
import Details from "./components/details/Details";
import Userinfo from "./components/userinfo/Userinfo";
import Title from "./components/title/Title";
import Menu from "./components/menu/Menu";
import Mobilemenu from "./components/mobilemenu/Mobilemenu";
import { useState, useEffect, useContext } from "react";
import { getStyleScheme } from "./styles";
import Login from "./components/login/Login";
import Usermanager from "./components/usermanager/Usermanager";
import About from "./components/about/About";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import { useBlogStore } from "./lib/blogStore";
import { useBlogListStore } from "./lib/blogListStore";
import Search from "./components/search/Search";
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate, useLocation } from 'react-router-dom';
import { StoreContext, StoreProvider } from "./lib/store";

const App = () => {
    const context = useContext(StoreContext);
    const showAbout = context.showAbout;
    const setShowAbout = context.setShowAbout;
    const editMode = context.editMode;
    const setEditMode = context.setEditMode;
    const createMode = context.createMode;
    const setCreateMode = context.setCreateMode;
    const showUserstuff = context.showUserstuff;
    const setShowUserstuff = context.setShowUserstuff;
    const showSearch = context.showSearch;
    const setShowSearch = context.setShowSearch;
    const currentBlogId = context.currentBlogId;
    const setCurrentBlogId = context.setCurrentBlogId;
    const setNewBlogTitle = context.setNewBlogTitle;
    const setNewBlogTags = context.setNewBlogTags;
    const setNewBlogContent = context.setNewBlogContent;
    const setNewBlogPublic = context.setNewBlogPublic;
    const setNewDisableComments = context.setNewDisableComments;
    const topic = context.topic;
    const setTopic = context.setTopic;
    const styleScheme = getStyleScheme(topic);
    const navigate = useNavigate();
    const location = useLocation();

    const { currentUser, fetchUserInfo } = useUserStore();
    const { currentBlog, fetchBlogInfo } = useBlogStore();
    const { currentBlogList, fetchBlogListInfo, isLoadingBlogList } = useBlogListStore(); // Access loading state

    // Fetch user info when auth state changes
    useEffect(() => {
        const unSub = onAuthStateChanged(auth, (user) => {
            fetchUserInfo(user?.uid);
        });

        return () => {
            unSub();
        };
    }, [fetchUserInfo]);

    // Fetch blog info when currentBlogId changes
    useEffect(() => {
        if (currentBlogId) {
            fetchBlogInfo(currentBlogId); // Fetches the blog info and sets up a real-time listener
        }
    }, [currentBlogId, fetchBlogInfo]);

    // Update topic when currentBlog changes
    useEffect(() => {
        if (currentBlog) {
            setTopic(currentBlog.topic);
            document.title = currentBlog.title + " | Manus Blog";
        }
    }, [currentBlog]);

    // Fetch blog list info on component mount
    useEffect(() => {
        fetchBlogListInfo();
    }, [fetchBlogListInfo]);

    // Reset new blog fields when not in edit mode
    useEffect(() => {
        if (!editMode) {
            setNewBlogTitle("");
            setNewBlogTags("");
            setNewBlogContent("");
            setNewBlogPublic(false);
            setNewDisableComments(false);
        }
    }, [editMode]);

    // Set the current blog to the newest public one when blog list is loaded
    useEffect(() => {
        if (!isLoadingBlogList && currentBlogList.length > 0 && location.pathname === "/") {
            const firstPublicBlog = currentBlogList.find(blog => blog.isPublic);
            if (firstPublicBlog) {
                setCurrentBlogId(firstPublicBlog.id); // First public blog
                navigate(`/${firstPublicBlog.id}`);
            }
        }
    }, [isLoadingBlogList, currentBlogList, location.pathname, navigate]);

    // Update body styles based on the topic's style scheme
    useEffect(() => {
        if (styleScheme.bodyBackgroundColor) {
            document.body.style.backgroundImage = 'none';
            document.body.style.backgroundColor = styleScheme.bodyBackgroundColor;
        } else {
            document.body.style.backgroundImage = styleScheme.bodyBackgroundImage;
        }
        return () => {
            document.body.style.backgroundImage = null;
        };
    }, [styleScheme]);



    const handleNewBlogButton = () => {
        setCreateMode(!createMode);
        setEditMode(false);
    };


    return (
        <>
            <div className='header'
                style={{
                    backgroundColor: styleScheme.headerBGColor,
                    color: styleScheme.headerTextColor,
                    borderColor: styleScheme.headerBorderColor
                }}
            >
                <Menu />
                <button
                    style={{
                        color: styleScheme.headerTextColor,
                        borderColor: styleScheme.headerBorderColor
                    }}
                    onClick={handleNewBlogButton}>New Blog</button>
                <Title />
                <button
                    style={{
                        color: styleScheme.headerTextColor,
                        borderColor: styleScheme.headerBorderColor
                    }} onClick={() => setShowSearch(!showSearch)}>All Blogs</button>
                <Userinfo />
            </div>

            <div className='mobileheader'
                style={{
                    backgroundColor: styleScheme.headerBGColor,
                    color: styleScheme.headerTextColor,
                    borderColor: styleScheme.headerBorderColor
                }}
            >
                <Mobilemenu />
            </div>

            <div className='container'
                style={{
                    backgroundColor: styleScheme.containerBGColor,
                    color: styleScheme.containerTextColor,
                    borderColor: styleScheme.containerBorderColor
                }}
            >
                {isLoadingBlogList ? (
                    <div className="loadingblogs">Loading...</div> // Display loading message while fetching blogs
                ) : showAbout ? (
                    <About />
                ) : showUserstuff ? (
                    <>
                        {currentUser ? <Usermanager /> : <Login />}
                    </>
                ) : showSearch ? (
                    <Search />
                ) : (
                    <>
                        <List />
                        <Routes>
                            <Route path="/" element={<Blog />} />
                            <Route path="/:blogId" element={<Blog />} />
                            <Route path="*" element={<div>404 Not Found</div>} />
                        </Routes>
                        <Details />
                    </>
                )}
            </div>
        </>
    );

}

export default App;