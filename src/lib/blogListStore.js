import { collection, doc, onSnapshot } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";

export const useBlogListStore = create((set) => ({
  currentBlogList: null,
  isLoadingBlogList: true,
  unsubscribeFromBlogList: null, // Store the unsubscribe function

  fetchBlogListInfo: () => {
    // Unsubscribe from previous blog listener if it exists
    if (useBlogListStore.getState().unsubscribeFromBlogList) {
      useBlogListStore.getState().unsubscribeFromBlogList();
    }

    const docRef = doc(collection(db, "blogs"));
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        set({ currentBlogList: docSnap.data(), isLoadingBlogList: false });
      } else {
        set({ currentBlogList: null, isLoadingBlogList: false });
      }
    });

    // const querySnapshot = await getDocs(collection(db, "blogs"));
    // querySnapshot.forEach((doc) => {
    //   // doc.data() is never undefined for query doc snapshots
    //   console.log(doc.id, " => ", doc.data());

    // });

    // Save the unsubscribe function
    set({ unsubscribeFromBlogList: unsubscribe });
  },
}));