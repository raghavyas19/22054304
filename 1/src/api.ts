import { User, Post, Comment } from './types';

const API_BASE_URL = '/evaluation-service';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNjA2Mjg2LCJpYXQiOjE3NDM2MDU5ODYsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImJhZTgwNTAxLWVlNTEtNDg3ZS05ZTNhLTYzYjRjMDc5ZGIxNiIsInN1YiI6IjIyMDU0MzA0QGtpaXQuYWMuaW4ifSwiZW1haWwiOiIyMjA1NDMwNEBraWl0LmFjLmluIiwibmFtZSI6InJhZ2hhdiB2eWFzIiwicm9sbE5vIjoiMjIwNTQzMDQiLCJhY2Nlc3NDb2RlIjoibndwd3JaIiwiY2xpZW50SUQiOiJiYWU4MDUwMS1lZTUxLTQ4N2UtOWUzYS02M2I0YzA3OWRiMTYiLCJjbGllbnRTZWNyZXQiOiJ6cVlueXZnRFZuUGNuUW1OIn0.dMJG88HSY7VQrHp51E_3iVdnIWDR7bv7v0D1eRkHqd0';

const headers = {
  'Authorization': `Bearer ${ACCESS_TOKEN}`,
  'Content-Type': 'application/json'
};

const transformUsers = (usersObj: Record<string, string>): User[] => {
  return Object.entries(usersObj).map(([id, name]) => ({
    id,
    name,
    postCount: 0,
    avatar: ``,
  }));
};

export const fetchTopUsers = async (): Promise<User[]> => {
  try {
    const usersResponse = await fetch(`${API_BASE_URL}/users`, { headers });
    if (!usersResponse.ok) {
      throw new Error(`HTTP error! status: ${usersResponse.status}`);
    }
    const usersData = await usersResponse.json();
    let users = transformUsers(usersData.users);

    await Promise.all(
      users.map(async (user) => {
        const postsResponse = await fetch(`${API_BASE_URL}/users/${user.id}/posts`, { headers });
        if (!postsResponse.ok) {
          throw new Error(`HTTP error! status: ${postsResponse.status}`);
        }
        const postsData = await postsResponse.json();
        user.postCount = postsData.posts.length;
      })
    );
    return users
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 5);
  } catch (error) {
    console.error('Error fetching top users:', error);
    throw error;
  }
};

export const fetchTrendingPosts = async (): Promise<Post[]> => {
  try {    const usersResponse = await fetch(`${API_BASE_URL}/users`, { headers });
    if (!usersResponse.ok) {
      throw new Error(`HTTP error! status: ${usersResponse.status}`);
    }
    const usersData = await usersResponse.json();
    const userIds = Object.keys(usersData.users);

    const allPosts: Post[] = [];
    await Promise.all(
      userIds.map(async (userId) => {
        const postsResponse = await fetch(`${API_BASE_URL}/users/${userId}/posts`, { headers });
        if (!postsResponse.ok) {
          throw new Error(`HTTP error! status: ${postsResponse.status}`);
        }
        const postsData = await postsResponse.json();
        
        await Promise.all(
          postsData.posts.map(async (post: any) => {
            const commentsResponse = await fetch(`${API_BASE_URL}/posts/${post.id}/comments`, { headers });
            if (!commentsResponse.ok) {
              throw new Error(`HTTP error! status: ${commentsResponse.status}`);
            }
            const commentsData = await commentsResponse.json();
            
            allPosts.push({
              id: post.id.toString(),
              userId: post.userid.toString(),
              content: post.content,
              timestamp: new Date().toISOString(),
              commentCount: commentsData.comments.length,
              image: `https://picsum.photos${post.id}`,
            });
          })
        );
      })
    );
    const maxComments = Math.max(...allPosts.map(post => post.commentCount));
    return allPosts.filter(post => post.commentCount === maxComments);
  } catch (error) {
    console.error('Error fetching trending posts:', error);
    throw error;
  }
};

export const fetchFeed = async (): Promise<Post[]> => {
  try {    const usersResponse = await fetch(`${API_BASE_URL}/users`, { headers });
    if (!usersResponse.ok) {
      throw new Error(`HTTP error! status: ${usersResponse.status}`);
    }
    const usersData = await usersResponse.json();
    const userIds = Object.keys(usersData.users);

    const allPosts: Post[] = [];
    await Promise.all(
      userIds.map(async (userId) => {
        const postsResponse = await fetch(`${API_BASE_URL}/users/${userId}/posts`, { headers });
        if (!postsResponse.ok) {
          throw new Error(`HTTP error! status: ${postsResponse.status}`);
        }
        const postsData = await postsResponse.json();
        
        await Promise.all(
          postsData.posts.map(async (post: any) => {
            const commentsResponse = await fetch(`${API_BASE_URL}/posts/${post.id}/comments`, { headers });
            if (!commentsResponse.ok) {
              throw new Error(`HTTP error! status: ${commentsResponse.status}`);
            }
            const commentsData = await commentsResponse.json();
            
            allPosts.push({
              id: post.id.toString(),
              userId: post.userid.toString(),
              content: post.content,
              timestamp: new Date().toISOString(),
              commentCount: commentsData.comments.length,
              image: `https://picsum.photos${post.id}`,
            });
          })
        );
      })
    );

    return allPosts.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error('Error fetching feed:', error);
    throw error;
  }
};