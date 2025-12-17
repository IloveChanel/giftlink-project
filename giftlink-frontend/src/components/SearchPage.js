import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchPage.css';

function SearchPage({ user }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3060';

  const categories = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Office', 'Outdoor', 'Other'];
  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSearched(true);

    try {
      let url = `${backendUrl}/api/search?`;
      if (searchQuery) url += `q=${encodeURIComponent(searchQuery)}&`;
      if (category) url += `category=${encodeURIComponent(category)}&`;
      if (condition) url += `condition=${encodeURIComponent(condition)}&`;

      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Search failed');
      }
      
      setResults(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGiftClick = (giftId) => {
    navigate(`/gifts/${giftId}`);
  };

  const handleBack = () => {
    navigate('/home');
  };

  return (
    <div className="search-page">
      <header className="search-header">
        <h1>GiftLink Search</h1>
        <button onClick={handleBack} className="btn btn-back">Back to Home</button>
      </header>
      
      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-row">
            <div className="form-group">
              <label>Search Query</label>
              <input
                type="text"
                placeholder="Enter keywords (e.g., 'Older gifts in Living room')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Condition</label>
              <select value={condition} onChange={(e) => setCondition(e.target.value)}>
                <option value="">All Conditions</option>
                {conditions.map(cond => (
                  <option key={cond} value={cond}>{cond}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button type="submit" className="btn btn-search">Search</button>
        </form>
        
        {loading && <div className="loading">Searching...</div>}
        
        {error && <div className="error-message">{error}</div>}
        
        {searched && !loading && (
          <div className="results-container">
            <h2>Search Results ({results.length})</h2>
            
            {results.length === 0 ? (
              <p className="no-results">No gifts found matching your criteria.</p>
            ) : (
              <div className="gifts-grid">
                {results.map((gift) => (
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
        )}
      </div>
    </div>
  );
}

export default SearchPage;
