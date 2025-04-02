import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { fetchTopUsers } from '../api';
import { Trophy } from 'lucide-react';

const TopUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchTopUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching top users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
    const interval = setInterval(loadUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="row">
      <h1 className="mb-4">Top Users <Trophy className="text-warning" /></h1>
      {users.map((user, index) => (
        <div key={user.id} className="col-md-4 mb-4">
          <div className="card h-100">
            <img src={user.avatar} className="card-img-top" alt={user.name} />
            <div className="card-body">
              <h5 className="card-title">{index + 1}. {user.name}</h5>
              <p className="card-text">
                Total Posts: <span className="badge bg-primary">{user.postCount}</span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopUsers;