export enum QUERY_KEYS {
  // USER KEYS
  GET_CURRENT_USER = "getCurrentUser",
  GET_USERS = "getUsers",
  GET_USER_BY_ID = "getUserById",
  GET_CURRENT_USER_SAVES = "getCurrentUserSaves",

  // POST KEYS
  GET_POSTS = "getPosts",
  GET_INFINITE_POSTS = "getInfinitePosts",
  GET_INFINITE_POSTS_EXPLORE = "getInfinitePostsExplore",
  GET_RECENT_POSTS = "getRecentPosts",
  GET_POST_BY_ID = "getPostById",
  GET_USER_POSTS = "getUserPosts",
  GET_FILE_PREVIEW = "getFilePreview",
  GET_LIKED_POSTS = "getLikedPosts",

  //  SEARCH KEYS
  SEARCH_POSTS = "getSearchPosts",
  SEARCH_USERS = "getSearchUsers",

  // COMMENT KEYS

  GET_COMMENT_BY_ID = "getCommentById",

  GET_COMMENTS_BY_POSTID = "getCommentsByPostId",
}