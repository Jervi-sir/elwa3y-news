import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { articleIsBookmarked, bookmarkArticle, removeBookmarkedArticle, countBookmarks, fetchBookmarks, clearAllBookmarks } from 'functions/db';

const BookmarkContext = createContext(null);

export const useBookmarks = () => useContext(BookmarkContext);

export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  const [offset, setOffset] = useState(0);
  const limit = 10; 
  
  // Load bookmarks on mount
  useEffect(() => {
    //DBinit();
    loadBookmarks(true); // Initial load, reset=true
    updateBookmarkCount();
  }, []);

  const loadBookmarks = useCallback((reset = false) => {
    return new Promise((resolve, reject) => {
      const currentOffset = reset ? 0 : offset;
  
      fetchBookmarks(currentOffset, limit, (success, data) => {
        if (success) {
          setBookmarks((prevBookmarks) => reset ? [...data] : [...prevBookmarks, ...data]);
          setOffset((prevOffset) => reset ? data.length : prevOffset + data.length);
          resolve(data); // Resolve the promise with the fetched data
        } else {
          reject(new Error("Failed to load bookmarks")); // Reject the promise if fetching bookmarks failed
        }
      });
    });
  }, [offset, limit]);
  

  const updateBookmarkCount = useCallback(() => {
    countBookmarks((success, count) => {
      if (success) {
        setBookmarkCount(count);
      }
    });
  }, []);


  const addBookmark = useCallback((article, callback) => {
    bookmarkArticle(article, (success, result) => {
      if (success) {
        loadBookmarks(); // Reload bookmarks to include the new one
        updateBookmarkCount(); // Update the count
        callback(true); // Indicate success
      } else {
        console.log("Failed to add bookmark:", result);
        callback(false, result); // Indicate failure and provide error information
      }
    });
  }, [loadBookmarks, updateBookmarkCount]);

  const removeBookmark = useCallback((articleId, callback) => {
    removeBookmarkedArticle(articleId, (success) => {
      if (success) {
        setBookmarks((prevBookmarks) => prevBookmarks.filter(article => article.id !== articleId));
        setBookmarkCount((prevCount) => prevCount - 1);
        callback(true); // Indicate success to the caller
      } else {
        console.log("Failed to remove bookmark");
        callback(false); // Indicate failure to the caller
      }
    });
  }, []);
  
  const checkArticleIsBookmarked = useCallback((articleId, callback) => {
    articleIsBookmarked(articleId, callback);
  }, []);

  const refreshBookmarks = useCallback(() => {
    return new Promise((resolve, reject) => {
      setOffset(0); // Reset offset
      setBookmarks([]); // Clear current bookmarks
      loadBookmarks(true) // Reload bookmarks with reset
        .then(data => {
          updateBookmarkCount(); // Optionally update the bookmark count if necessary
          resolve(data); // Resolve the promise with the reloaded data
        })
        .catch(error => {
          console.error("Error refreshing bookmarks:", error);
          reject(error); // Reject the promise if loading bookmarks fails
        });
    });
  }, [loadBookmarks, updateBookmarkCount]);

  const clearAllBookmarksAndUpdateCount = () => {
    clearAllBookmarks((success, result) => {
      if (success) {
        console.log('All bookmarks cleared successfully');
        // After clearing, update the bookmark count to 0
        setBookmarkCount(0);
      } else {
        console.error('Failed to clear all bookmarks');
      }
    });
  };

  const value = {
    bookmarks,
    bookmarkCount,
    addBookmark,
    removeBookmark,
    checkArticleIsBookmarked,
    loadBookmarks,
    clearAllBookmarksAndUpdateCount,
    refreshBookmarks
  };

  return <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>;
};

