import List from "./components/list/List";
import Blog from "./components/blog/Blog";
import Details from "./components/details/Details";
import Userinfo from "./components/userinfo/Userinfo";
import Title from "./components/title/Title";
import Menu from "./components/menu/Menu";
import { useState, useEffect } from "react";
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

const App = () => {
  const [topic, setTopic] = useState("other");
  const styleScheme = getStyleScheme(topic);
  const [showUserstuff, setShowUserstuff] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState("welcome");
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogTags, setNewBlogTags] = useState("");
  const [newBlogContent, setNewBlogContent] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [showSearch, setShowSearch] = useState(false); // AllBlogs

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
    }
  }, [editMode]);

  // Set the current blog to the newest one when blog list is loaded
  useEffect(() => {
    if (!isLoadingBlogList && currentBlogList.length > 0) {
      setCurrentBlogId(currentBlogList[0]?.id); // Newest blog is the first in the list
    }
  }, [isLoadingBlogList, currentBlogList]);

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

  return (
    <>
      <div className='header'
        style={{
          backgroundColor: styleScheme.headerBGColor,
          color: styleScheme.headerTextColor,
          borderColor: styleScheme.headerBorderColor
        }}
      >
        <Menu showAbout={showAbout} setShowAbout={setShowAbout} />
        <button
          style={{
            color: styleScheme.headerTextColor,
            borderColor: styleScheme.headerBorderColor
          }}
          onClick={() => setCreateMode(true)}>New Blog</button>
        <Title />
        <button
          style={{
            color: styleScheme.headerTextColor,
            borderColor: styleScheme.headerBorderColor
          }} onClick={() => setShowSearch(!showSearch)}>All Blogs</button>
        <Userinfo showUserstuff={showUserstuff} setShowUserstuff={setShowUserstuff} />
      </div>

      <div className='container'
        style={{
          backgroundColor: styleScheme.containerBGColor,
          color: styleScheme.containerTextColor,
          borderColor: styleScheme.containerBorderColor
        }}
      >
        {isLoadingBlogList ? (
          <div>Loading...</div> // Display loading message while fetching blogs
        ) : showAbout ? (
          <About />
        ) : showUserstuff ? (
          <>
            {currentUser ? <Usermanager /> : <Login setShowUserstuff={setShowUserstuff} />}
          </>
        ) : showSearch ? (
          <Search showSearch={showSearch} setShowSearch={setShowSearch} setCurrentBlogId={setCurrentBlogId} />
        ) : (
          <>
            <List setCurrentBlogId={setCurrentBlogId} />
            <Blog
              createMode={createMode}
              setCreateMode={setCreateMode}
              setTopic={setTopic}
              topic={topic}
              currentBlogId={currentBlogId}
              setCurrentBlogId={setCurrentBlogId}
              newBlogTitle={newBlogTitle}
              setNewBlogTitle={setNewBlogTitle}
              newBlogTags={newBlogTags}
              setNewBlogTags={setNewBlogTags}
              newBlogContent={newBlogContent}
              setNewBlogContent={setNewBlogContent}
              editMode={editMode}
              setEditMode={setEditMode}
            />
            <Details
              topic={topic}
              setTopic={setTopic}
              createMode={createMode}
              setCreateMode={setCreateMode}
              setNewBlogTitle={setNewBlogTitle}
              setNewBlogTags={setNewBlogTags}
              setNewBlogContent={setNewBlogContent}
              setEditMode={setEditMode}
              setCurrentBlogId={setCurrentBlogId}
            />
          </>
        )}
      </div>
    </>
  );
}

export default App;