// import { collection, onSnapshot } from "firebase/firestore";
// import { create } from "zustand";
// import { db } from "./firebase";

// export const useBlogListStore = create((set) => ({
//   currentBlogList: [],  // Will store an array of blogs
//   isLoadingBlogList: true,
//   unsubscribeFromBlogList: null,

//   fetchBlogListInfo: () => {
//     // Unsubscribe from previous blog listener if it exists
//     if (useBlogListStore.getState().unsubscribeFromBlogList) {
//       useBlogListStore.getState().unsubscribeFromBlogList();
//     }

//     // Reference to the "blogs" collection
//     const collectionRef = collection(db, "blogs");

//     // Listen to real-time updates in the "blogs" collection
//     const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
//       const blogs = [];
//       querySnapshot.forEach((doc) => {
//         blogs.push({ id: doc.id, ...doc.data() });  // Collect each blog's data with the document ID
//       });

//       set({ currentBlogList: blogs, isLoadingBlogList: false });
//     });

//     // Save the unsubscribe function
//     set({ unsubscribeFromBlogList: unsubscribe });
//   },
// }));

import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";

export const useBlogListStore = create((set) => ({
  currentBlogList: [],  // Will store an array of blogs
  isLoadingBlogList: true,
  unsubscribeFromBlogList: null,

  fetchBlogListInfo: () => {
    // Unsubscribe from previous blog listener if it exists
    if (useBlogListStore.getState().unsubscribeFromBlogList) {
      useBlogListStore.getState().unsubscribeFromBlogList();
    }

    // Reference to the "blogs" collection with ordering by "created" field in descending order
    const collectionRef = collection(db, "blogs");
    const orderedQuery = query(collectionRef, orderBy("created", "desc"));  // Ordering by 'created' timestamp, newest first

    // Listen to real-time updates in the "blogs" collection
    const unsubscribe = onSnapshot(orderedQuery, (querySnapshot) => {
      const blogs = [];
      querySnapshot.forEach((doc) => {
        blogs.push({ id: doc.id, ...doc.data() });  // Collect each blog's data with the document ID
      });

      set({ currentBlogList: blogs, isLoadingBlogList: false });
    });

    // Save the unsubscribe function
    set({ unsubscribeFromBlogList: unsubscribe });
  },
}));