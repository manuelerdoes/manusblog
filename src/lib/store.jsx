// store.js
import { createContext, useState } from 'react';

const StoreContext = createContext();

const StoreProvider = ({ children }) => {
  const [currentBlogId, setCurrentBlogId] = useState("welcome");
  const [topic, setTopic] = useState("other");
  const [showUserstuff, setShowUserstuff] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [createMode, setCreateMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showSearch, setShowSearch] = useState(false); // AllBlogs
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogTags, setNewBlogTags] = useState("");
  const [newBlogContent, setNewBlogContent] = useState("");
  const [temporaryBlogId, setTemporaryBlogId] = useState(null);
  const [newBlogPublic, setNewBlogPublic] = useState(false);
  const [newDisableComments, setNewDisableComments] = useState(false);
  const [serverImages, setServerImages] = useState([]);


  return (
    <StoreContext.Provider value={{
      currentBlogId,
      setCurrentBlogId,
      topic,
      setTopic,
      showUserstuff,
      setShowUserstuff,
      showAbout,
      setShowAbout,
      createMode,
      setCreateMode,
      editMode,
      setEditMode,
      showSearch,
      setShowSearch,
      newBlogTitle,
      setNewBlogTitle,
      newBlogTags,
      setNewBlogTags,
      newBlogContent,
      setNewBlogContent,
      temporaryBlogId,
      setTemporaryBlogId,
      newBlogPublic,
      setNewBlogPublic,
      newDisableComments,
      setNewDisableComments,
      serverImages,
      setServerImages
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export { StoreProvider, StoreContext };