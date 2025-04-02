export interface User {
  id: string;
  name: string;
  postCount: number;
  avatar: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  timestamp: string;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  commentCount: number;
  image: string;
}