import React, { createContext, useContext, useState, useEffect } from 'react';

const ArticlesContext = createContext(null);


export const useArticles = () => {
  return useContext(ArticlesContext);
};

export const ArticlesProvider = ({ children }) => {
  const [articles, setArticles] = useState(null);

  const value = {
    articles, setArticles, 
  };

  return (
    <ArticlesContext.Provider value={value}>
      {children}
    </ArticlesContext.Provider>
  );
};
