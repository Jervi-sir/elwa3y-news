import { articleIsBookmarked } from 'functions/db';
import React, { createContext, useContext, useState } from 'react';

const M1Context = createContext(null);

export const useM1Context = () => useContext(M1Context);

export const M1Provider = ({ children }) => {
  const [articlesByCategory, setArticlesByCategory] = useState({});

  const updateArticlesForCategory = (category, articles) => {
    // Loop through each article
    const updatedArticles = articles.map(async (article) => {
      // Determine if article is bookmarked
      const isBookmarked = await new Promise((resolve) => {
        articleIsBookmarked(article.id, (isBookmarked) => {
          resolve(isBookmarked);
        });
      });

      // Merge isBookmarked property into article object
      return { ...article, isBookmarked };
    });

    // Update state with updated articles
    Promise.all(updatedArticles).then((updatedArticles) => {
      setArticlesByCategory((prevState) => ({
        ...prevState,
        [category]: updatedArticles,
      }));
    });
  };
  const updateArticlePropertyById = (articleId, updates) => {
    setArticlesByCategory(prevState => {
      const newState = { ...prevState };

      Object.keys(newState).forEach(category => {
        const articles = newState[category];
        const articleIndex = articles.findIndex(article => article.id === articleId);
        if (articleIndex !== -1) {
          const articleToUpdate = articles[articleIndex];
          // Update article properties based on updates object
          const updatedArticle = {
            ...articleToUpdate,
            ...updates,
          };
          newState[category] = [
            ...articles.slice(0, articleIndex),
            updatedArticle,
            ...articles.slice(articleIndex + 1),
          ];
        }
      });

      return newState;
    });
  };


  return (
    <M1Context.Provider value={{ articlesByCategory, updateArticlesForCategory, updateArticlePropertyById }}>
      {children}
    </M1Context.Provider>
  );
};

/*
articlesByCategory[category]
updateArticlesForCategory(category, articles);

const toggleLikeStatus = (articleId, isLiked) => {
  updateArticlePropertyById(articleId, { isLiked: !isLiked });
};

const updateLikeCount = (articleId, likeCount) => {
  updateArticlePropertyById(articleId, { likeCount });
};

const toggleBookmarkStatus = (articleId, isBookmarked) => {
  updateArticlePropertyById(articleId, { isBookmarked: !isBookmarked });
};

const updateCommentCount = (articleId, commentCount) => {
  updateArticlePropertyById(articleId, { commentCount });
};
*/