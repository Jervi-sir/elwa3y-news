import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

const db = SQLite.openDatabase('notifications.db');

const initDBNotification = () => {
  db.transaction((tx) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS notifications (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, thumbnail TEXT, slug TEXT, received_at TEXT, isRead INTEGER DEFAULT 0);'
    );
  });
};

const insertNotification = async (title, thumbnailUrl, slug, isRead = 0) => {
  try {
    const fileName = `${new Date().getTime()}.jpg`;
    const localUri = `${FileSystem.documentDirectory}${fileName}`;
    const { uri } = await FileSystem.downloadAsync(thumbnailUrl, localUri);
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 69 } }], // adjust the size as needed
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // adjust compression as needed
    );
    // Insert it into the SQLite database
    const receivedAt = new Date().toISOString();
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO notifications (title, thumbnail, slug, received_at, isRead) VALUES (?, ?, ?, ?, ?);',
        [title, manipResult.uri, slug, receivedAt, isRead]
      );
    });

  } catch (error) {
    console.error("Error manipulating the image:", error);
  }
};

const updateNotification = (id, newTitle, newThumbnail, newIsRead) => {
  db.transaction((tx) => {
    tx.executeSql(
      'UPDATE notifications SET title = ?, body = ?, isRead = ? WHERE id = ?;',
      [newTitle, newThumbnail, newIsRead, id]
    );
  });
};

const markNotificationAsRead = (id) => {
  db.transaction((tx) => {
    tx.executeSql(
      'UPDATE notifications SET isRead = 1 WHERE id = ?;',
      [id]
    );
  });
};

const removeAllNotification = () => {
  db.transaction((tx) => {
    tx.executeSql(
      'DELETE FROM notifications;',
      [],
      (_, { rowsAffected }) => {
        console.log(`Deleted ${rowsAffected} rows.`);
      },
      (_, error) => {
        console.error("Failed to delete all notifications:", error);
        return true; // return false to stop transaction, true to continue
      }
    );
  });
};

const dropNotificationTable = () => {
  db.transaction((tx) => {
    tx.executeSql('DROP TABLE IF EXISTS notifications;', [], (_, result) => {
      console.log('Table dropped successfully:', result);
    },
    (_, error) => {
      console.log('Error dropping table:', error);
    });
  });
};

const getNotifications = (page = 1, pageSize = 10) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * pageSize;
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM notifications ORDER BY id DESC LIMIT ? OFFSET ?;',
        [pageSize, offset],
        (_, { rows }) => {
          resolve(rows._array);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
}

const countUnreadNotifications = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT COUNT(*) as unreadCount FROM notifications WHERE isRead = 0;',
        [],
        (_, { rows }) => {
          resolve(rows._array[0].unreadCount);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

const removeNotification = (id) => {
  db.transaction((tx) => {
    tx.executeSql(
      'DELETE FROM notifications WHERE id = ?;',
      [id],
      (_, { rowsAffected }) => {
        console.log(`Deleted ${rowsAffected} row(s).`);
      },
      (_, error) => {
        console.error("Failed to delete notification:", error);
        return true; // return false to stop transaction, true to continue
      }
    );
  });
};


export { 
  initDBNotification,
  insertNotification,
  updateNotification,
  getNotifications,
  markNotificationAsRead,
  removeAllNotification,
  dropNotificationTable,
  countUnreadNotifications,
  removeNotification
};
