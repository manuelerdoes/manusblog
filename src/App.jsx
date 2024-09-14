import List from "./components/list/List"
import Blog from "./components/blog/Blog"
import Details from "./components/details/Details"
import Userinfo from "./components/userinfo/Userinfo"
import Title from "./components/title/Title"
import Menu from "./components/menu/Menu"
import { useState, useEffect } from "react"
import { getStyleScheme } from "./styles";
import Login from "./components/login/Login"
import Usermanager from "./components/usermanager/Usermanager"
import About from "./components/about/About"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./lib/firebase"
import { useUserStore } from "./lib/userStore"
import { useBlogStore } from "./lib/blogStore"
import { useBlogListStore } from "./lib/blogListStore"

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

  const { currentUser, fetchUserInfo } = useUserStore();
  const { currentBlog, fetchBlogInfo } = useBlogStore();
  const { currentBlogList, fetchBlogListInfo } = useBlogListStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    }
  }, [fetchUserInfo]);

  useEffect(() => {
    if (currentBlogId) {
      fetchBlogInfo(currentBlogId); // Fetches the blog info and sets up a real-time listener
    }
  }, [currentBlogId, fetchBlogInfo]);

  useEffect(() => {
    if (currentBlog) {
      setTopic(currentBlog.topic);
    }
  }, [currentBlog]);

  useEffect(() => {
      fetchBlogListInfo();
  }, [fetchBlogListInfo]);

  useEffect(() => {
    // Update the body background image and other styles
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
          }}>All Blogs</button>
        <Userinfo showUserstuff={showUserstuff} setShowUserstuff={setShowUserstuff} />
      </div >


      <div className='container'
        style={{
          backgroundColor: styleScheme.containerBGColor,
          color: styleScheme.containerTextColor,
          borderColor: styleScheme.containerBorderColor
        }}
      >


        {
          showAbout ? (
            <About />
          ) : (
            showUserstuff ? (
              <>
                {currentUser ? <Usermanager /> : <Login setShowUserstuff={setShowUserstuff} />}
              </>
            ) : (
              <>
                <List setCurrentBlogId={setCurrentBlogId}/>
                <Blog createMode={createMode} setCreateMode={setCreateMode}
                  setTopic={setTopic} topic={topic} currentBlogId={currentBlogId} 
                  setCurrentBlogId={setCurrentBlogId} newBlogTitle={newBlogTitle} 
                  setNewBlogTitle={setNewBlogTitle} newBlogTags={newBlogTags} 
                  setNewBlogTags={setNewBlogTags} newBlogContent={newBlogContent} 
                  setNewBlogContent={setNewBlogContent} editMode={editMode}/>
                <Details topic={topic} setTopic={setTopic} createMode={createMode} 
                  setCreateMode={setCreateMode} setNewBlogTitle={setNewBlogTitle}
                  setNewBlogTags={setNewBlogTags} setNewBlogContent={setNewBlogContent}
                  setEditMode={setEditMode} setCurrentBlogId={setCurrentBlogId}/>
              </>
            ))
        }

      </div>
    </>
  )
}

export default App
