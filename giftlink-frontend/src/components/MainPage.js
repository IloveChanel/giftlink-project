import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';

function MainPage({ user, onLogout }) {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3060';

  useEffect(() => {
    fetchGifts();
  }, []);

  const fetchGifts = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/gifts`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch gifts');
      }
      
      setGifts(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGiftClick = (giftId) => {
    navigate(`/gifts/${giftId}`);
  };

  const handleSearchClick = () => {
    navigate('/search');
  };

  if (loading) {
    return <div className="loading">Loading gifts...</div>;
  }

  return (
    <div className="main-page">
      <header className="main-header">
        <h1>GiftLink</h1>
        <div className="user-info">
          <span>Welcome, {user.firstName}!</span>
          <button onClick={handleSearchClick} className="btn btn-search">Search</button>
          <button onClick={onLogout} className="btn btn-logout">Logout</button>
        </div>
      </header>
      
      <div className="gifts-container">
        <h2>Available Gifts</h2>
        {error && <div className="error-message">{error}</div>}
        
        {gifts.length === 0 ? (
          <p className="no-gifts">No gifts available at the moment.</p>
        ) : (
          <div className="gifts-grid">
            {gifts.map((gift) => (
              <div 
                key={gift._id} 
                className="gift-card"
                onClick={() => handleGiftClick(gift._id)}
              >
                <div className="gift-image">
                  {gift.imageUrl ? (
                    <img src={gift.imageUrl} alt={gift.name} />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>
                <div className="gift-info">
                  <h3>{gift.name}</h3>
                  <p className="gift-category">{gift.category}</p>
                  <p className="gift-condition">Condition: {gift.condition}</p>
                  <p className="gift-age">Age: {gift.age}</p>
                  <p className="gift-user">Posted by: {gift.userName}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MainPage;
