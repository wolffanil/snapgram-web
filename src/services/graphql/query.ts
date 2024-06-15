export const getAllPosts = `query getPosts($page: Int, $limit: Int, $q:String) {
	posts(page: $page, limit: $limit, q: $q) {
  	_id
    creator {
      _id
      name
      imageUrl
      bio
      isOnline
      createdAt
      updatedAt
    }
    caption
    countRepost
    tags
    location
    imageUrl
    createdAt
    updatedAt
    commentsCount
    saves {
      _id
      postId
      userId
    }
    likes {
      _id
      userId
      postId
      createdAt
      updatedAt
    }
  }
}`;

export const getPostById = `
query getPost($postId: String) {
	post(postId: $postId) {
    _id
    creator {
      _id
      name
      imageUrl
      isOnline
      createdAt
      updatedAt
      nick
    }
    caption
    countRepost
    tags
    location
    imageUrl
    createdAt
    updatedAt
    saves {
      _id
      postId
      userId
    }
    likes {
      _id
      userId
      postId
      createdAt
      updatedAt
    }
    comments {
      _id
      postId
      author {
				_id
        name
        imageUrl
      }
      text
      createdAt
      updatedAt
      likes {
        _id
        userId
        commentId
      }
    }
  }
}`;

export const getMySaves = `
  query getAllMyPosts {
    getMySaves {
      _id
      post {
        _id
        creator {
          _id
          name
          email
          imageUrl
          createdAt
          updatedAt
        }
        caption
        countRepost
        tags
        location
        imageUrl
        createdAt
        updatedAt
        saves {
          _id
          postId
          userId
          createdAt
          updatedAt
        }
        commentsCount
        likes {
          _id
          userId
          postId
        }
      }
      userId
      createdAt
      updatedAt
    }
  }
`;
