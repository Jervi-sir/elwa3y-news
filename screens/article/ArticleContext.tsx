import React, { createContext, useContext, useState, useEffect } from 'react';

const ArticleContext = createContext(null);

export const useArticle = () => useContext(ArticleContext);

export const ArticleProvider = ({ children }) => {
  const [article, setArticle] = useState([]);
  const [comments, setComments] = useState([]);
  const [articles, setArticles] = useState([]);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [nbComments, setNbComments] = useState(null);

  const onIncreaseNbComments = () => {
    setNbComments(nbComments + 1 )
  }

  const onDecreaseNbComments = () => {
    setNbComments((prevNbComments) => prevNbComments > 0 ? prevNbComments - 1 : 0);
  }

  const value = {
    article, setArticle,
    comments, setComments,
    articles, setArticles,
    relatedPosts, setRelatedPosts,
    nbComments, setNbComments,
    onIncreaseNbComments, onDecreaseNbComments
  }

  return (
    <ArticleContext.Provider value={value}>
      {children}
    </ArticleContext.Provider>
  );
};

