import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

const db = SQLite.openDatabase('articles.db');
const downloadImage = async (imageUrl) => {
  try {
    //const fileExtension = imageUrl.substring(imageUrl.lastIndexOf('.')) || '.jpg'; // Include default extension
    const fileName = `image_${Math.random().toString(36).substr(2, 9)}.jpg`;
    const fileUri = FileSystem.documentDirectory + fileName //imageUrl.split('/').pop();
    const downloadResult = await FileSystem.downloadAsync(imageUrl, fileUri);

    if (downloadResult.status === 200) {
      return fileUri; // This is the local URI to the downloaded image
    } else {
      console.error('Download failed:', downloadResult);
      return null; // Handle the failure according to your app's needs
    }
  } catch (error) {
    console.error('Error downloading image:', error);
    return null;
  }
};
const checkFileAndDelete = async (filePath) => {
  const fileInfo = await FileSystem.getInfoAsync(filePath);
  if (fileInfo.exists) {
    console.log('File exists. Attempting to delete...');
    await FileSystem.deleteAsync(filePath);
    console.log('File deleted successfully.');
  } else {
    console.log('File does not exist at path:', filePath);
  }
};

const DBinit = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS bookmarks (
        id INTEGER NOT NULL,
        articleId INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT,
        title TEXT NOT NULL,
        recap TEXT,
        content TEXT NOT NULL,
        content_text TEXT,
        thumbnail TEXT,
        uploaded_since TEXT,
        created_at TEXT,
        category_name TEXT,
        time_to_read TEXT,
        views INTEGER,
        author_pic TEXT,
        author_name TEXT,
        author_slug TEXT,
        author_bio TEXT,
        tags TEXT,
        duration TEXT,
        nb_likes INTEGER,
        nb_comments INTEGER,
        isLiked INTEGER,
        bookmarked_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );`,
      [],
      () => console.log('Bookmarks table created successfully'),
      (_, err) => console.log('Failed to create bookmarks table', err)
    );
  });
};

const insertBookmark = async (article, callback) => {
  const { id, slug, title, recap, content, content_text, thumbnail, uploaded_since, created_at, category_name, time_to_read, views, author_pic, author_name, author_slug, author_bio, tags, duration, nb_likes, nb_comments, isLiked } = article;
  const localThumbnailPath = await downloadImage(article.thumbnail);

  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO bookmarks (id, slug, title, recap, content, content_text, thumbnail, uploaded_since, created_at, category_name, time_to_read, views, author_pic, author_name, author_slug, author_bio, tags, duration, nb_likes, nb_comments, isLiked)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [id, slug, title, recap, content, content_text, localThumbnailPath, uploaded_since, created_at, category_name, time_to_read, views, author_pic, author_name, author_slug, author_bio, JSON.stringify(tags), duration, nb_likes, nb_comments, isLiked ? 1 : 0],
      (_, result) => callback(true, result),
      (_, err) => callback(false, err)
    );
  });
};

const fetchBookmarks = (offset, limit, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM bookmarks ORDER BY bookmarked_at DESC LIMIT ? OFFSET ?;',
      [limit, offset],
      (_, { rows: { _array } }) => {
        const bookmarks = _array.map(article => ({
          ...article,
          tags: JSON.parse(article.tags),
          isLiked: !!article.isLiked
        }));
        callback(true, bookmarks);
      },
      (_, err) => callback(false, err)
    );
  });
};

const countBookmarks = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT COUNT(*) AS bookmarkCount FROM bookmarks;',
      [],
      (_, { rows }) => callback(true, rows._array[0].bookmarkCount),
      (_, err) => callback(false, err)
    );
  });
};

const articleIsBookmarked = (id, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT id FROM bookmarks WHERE id = ?;',
      [id],
      (_, { rows }) => callback(rows.length > 0),
      (_, err) => callback(false, err)
    );
  });
};

const removeBookmarkedArticle = async (id, callback) => {
  db.transaction(tx => {
    // First, attempt to fetch the thumbnail path for the specified ID
    tx.executeSql(
      'SELECT thumbnail FROM bookmarks WHERE id = ?;',
      [id],
      (_, { rows }) => {
        if (rows._array.length > 0) {
          const imagePath = rows._array[0].thumbnail;
          
          // Define a function to attempt file deletion, wrapped in try-catch for error handling
          const attemptFileDeletion = async (path) => {
            try {
              const fileInfo = await FileSystem.getInfoAsync(path);
              if (fileInfo.exists) {
                await FileSystem.deleteAsync(path);
                console.log('Image file deleted successfully');
              } else {
                console.log('File does not exist, no need to delete:', path);
              }
            } catch (error) {
              throw new Error(`Failed to delete image file: ${error.message}`);
            }
          };

          // Attempt to delete the file, then proceed to delete the database record
        
        } else {
          console.log('No article found with ID:', id);
          callback(false, { message: 'Article not found' });
        }
      },
      (_, err) => {
        console.error("Failed to fetch article for deletion:", err);
        callback(false, err);
      }
    );

    tx.executeSql(
      'DELETE FROM bookmarks WHERE id = ?;',
      [id],
      (_, result) => {
        if (result.rowsAffected > 0) {
          console.log(`Successfully deleted record with ID: ${id}`);
          callback(true, { message: "Record and file deleted successfully" });
        } else {
          console.error("No record found with ID:", id);
          callback(false, { message: "No record found to delete" });
        }
      },
      (_, err) => {
        console.error("Failed to delete record:", err);
        callback(false, err);
      }
    );
  });
};

const bookmarkArticle = (article, callback) => {
  articleIsBookmarked(article.id, (isBookmarked) => {
    if (!isBookmarked) {
      insertBookmark(article, callback);
    } else {
      console.log("Article already bookmarked");
      callback(false, { message: "Article is already bookmarked" });
    }
  });
};

const deleteBookmarksTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      'DROP TABLE IF EXISTS bookmarks;',
      [],
      (_, result) => console.log('Bookmarks table deleted successfully'),
      (_, err) => console.log('Failed to delete bookmarks table', err)
    );
  });
};

const clearAllBookmarks = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM bookmarks;',
      [],
      (_, result) => callback(true, result),
      (_, err) => callback(false, err)
    );
  });
};

const fetchBookmarkedArticleById = (articleId, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM bookmarks WHERE id = ?;',
      [articleId],
      (_, { rows: { _array } }) => callback(true, _array.length > 0 ? _array[0] : null),
      (_, err) => callback(false, err)
    );
  });
};

export { 
  DBinit, 
  bookmarkArticle, 
  fetchBookmarks, 
  articleIsBookmarked, 
  countBookmarks, 
  removeBookmarkedArticle, 
  deleteBookmarksTable,
  clearAllBookmarks,
  fetchBookmarkedArticleById,
};
