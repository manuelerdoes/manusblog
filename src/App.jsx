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

const App = () => {

  const [topic, setTopic] = useState("other");
  const styleScheme = getStyleScheme(topic);
  const [showUserstuff, setShowUserstuff] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  // const user = {
  //   name: "Oergel"
  // }
  // const user = null;

  const { currentUser, isLoading, fetchUserInfo } = useUserStore()

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    }
  }, [fetchUserInfo]);

  // console.log(currentUser);

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
        <Title />
        <Userinfo showUserstuff={showUserstuff} setShowUserstuff={setShowUserstuff} />
      </div>


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
                {currentUser ? <Usermanager /> : <Login />}
              </>
            ) : (
              <>
                <List />
                <Blog />
                <Details topic={topic} setTopic={setTopic} />
              </>
            ))
        }

      </div>
    </>
  )
}

export default App
