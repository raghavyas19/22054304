import React, { useEffect, useState } from 'react';
import { Post } from '../types';
import { fetchFeed } from '../api';
import { MessageSquare, Clock } from 'lucide-react';

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchFeed();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching feed:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
    const interval = setInterval(loadPosts, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <h1 className="mb-4">Live Feed <Clock className="text-success" /></h1>
      <div className="row">
        {posts.map(post => (
          <div key={post.id} className="col-12 mb-4">
            <div className="card">
              <div className="row g-0">
                <div className="col-md-4">
                  <img src={post.image} className="img-fluid rounded-start" alt="Post" />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <p className="card-text">{post.content}</p>
                    <div className="d-flex align-items-center mb-2">
                      <MessageSquare size={18} className="text-primary me-2" />
                      <span className="badge bg-primary">{post.commentCount} comments</span>
                    </div>
                    <p className="card-text">
                      <small className="text-muted">
                        Posted {new Date(post.timestamp).toLocaleString()}
                      </small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;