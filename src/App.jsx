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

const App = () => {

  const [topic, setTopic] = useState("other");
  const styleScheme = getStyleScheme(topic);
  const [showUserstuff, setShowUserstuff] = useState(false);
  const user = null

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
        <Menu />
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
        {showUserstuff ? (
          <>
            {user ? <Usermanager /> : <Login />}
          </>
        ) : (
          <>
            <List />
            <Blog />
            <Details topic={topic} setTopic={setTopic} />
          </>
        )}


      </div>
    </>
  )
}

export default App
