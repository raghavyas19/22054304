import React, { useEffect, useState } from 'react';
import { Post } from '../types';
import { fetchTrendingPosts } from '../api';
import { MessageSquare, Flame } from 'lucide-react';

const TrendingPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchTrendingPosts();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching trending posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
    const interval = setInterval(loadPosts, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <h1 className="mb-4">Trending Posts <Flame className="text-danger" /></h1>
      <div className="row">
        {posts.map(post => (
          <div key={post.id} className="col-md-6 mb-4">
            <div className="card h-100">
              <img src={post.image} className="card-img-top" alt="Post" />
              <div className="card-body">
                <p className="card-text">{post.content}</p>
                <div className="d-flex align-items-center">
                  <MessageSquare size={18} className="text-primary me-2" />
                  <span className="badge bg-primary">{post.commentCount} comments</span>
                </div>
              </div>
              <div className="card-footer text-muted">
                {new Date(post.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingPosts;