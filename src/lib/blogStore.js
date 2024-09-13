import { doc, onSnapshot } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";

export const useBlogStore = create((set) => ({
  currentBlog: null,
  isLoadingBlog: true,
  unsubscribeFromBlog: null, // Store the unsubscribe function

  fetchBlogInfo: (blogid) => {
    if (!blogid) return set({ currentBlog: null, isLoadingBlog: false });

    // Unsubscribe from previous blog listener if it exists
    if (useBlogStore.getState().unsubscribeFromBlog) {
      useBlogStore.getState().unsubscribeFromBlog();
    }

    const docRef = doc(db, "blogs", blogid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        set({ currentBlog: docSnap.data(), isLoadingBlog: false });
      } else {
        set({ currentBlog: null, isLoadingBlog: false });
      }
    });

    // Save the unsubscribe function
    set({ unsubscribeFromBlog: unsubscribe });
  },
}));