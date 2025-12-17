import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './GiftDetail.css';

function GiftDetail({ user }) {
  const { id } = useParams();
  const [gift, setGift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3060';

  useEffect(() => {
    fetchGiftDetail();
  }, [id]);

  const fetchGiftDetail = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/gifts/${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch gift details');
      }
      
      setGift(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/home');
  };

  if (loading) {
    return <div className="loading">Loading gift details...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={handleBack} className="btn btn-back">Back to Home</button>
      </div>
    );
  }

  if (!gift) {
    return <div className="error-container">Gift not found</div>;
  }

  return (
    <div className="gift-detail-page">
      <header className="detail-header">
        <h1>GiftLink</h1>
        <button onClick={handleBack} className="btn btn-back">Back to Home</button>
      </header>
      
      <div className="detail-container">
        <div className="detail-image">
          {gift.imageUrl ? (
            <img src={gift.imageUrl} alt={gift.name} />
          ) : (
            <div className="no-image-large">No Image Available</div>
          )}
        </div>
        
        <div className="detail-info">
          <h2>{gift.name}</h2>
          
          <div className="info-section">
            <h3>Description</h3>
            <p>{gift.description}</p>
          </div>
          
          <div className="info-grid">
            <div className="info-item">
              <strong>Category:</strong>
              <span>{gift.category}</span>
            </div>
            
            <div className="info-item">
              <strong>Condition:</strong>
              <span>{gift.condition}</span>
            </div>
            
            <div className="info-item">
              <strong>Age:</strong>
              <span>{gift.age}</span>
            </div>
            
            <div className="info-item">
              <strong>Posted by:</strong>
              <span>{gift.userName}</span>
            </div>
            
            {gift.sentiment && (
              <div className="info-item">
                <strong>Sentiment:</strong>
                <span className={`sentiment-${gift.sentiment.label}`}>
                  {gift.sentiment.label} ({gift.sentiment.score})
                </span>
              </div>
            )}
          </div>
          
          <div className="action-buttons">
            <button className="btn btn-contact">Contact Donor</button>
            <button className="btn btn-save">Save Gift</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GiftDetail;
