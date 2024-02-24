export default {
  base: process.env.EXPO_PUBLIC_API_URL,
  login: 'login',
  register: 'register',
  authenticated: 'auth/',
  validate_token: 'validate_token',

  subscribe_to_notifications: 'subscribe_notifications',
  unsubscribe_to_notifications: 'unsubscribe_notifications',

  logout: 'logout',
  profile: 'profile',
  update_profile: 'update-profile',

  home: 'home',
  article: 'article/',
  comments: '/comments',
  category: 'category/',

  like: 'like/',
  unlike: 'unlike/',

  search: 'search',

  editComment: 'auth/comment/',
  removeComment: 'auth/remove-comment/',
}