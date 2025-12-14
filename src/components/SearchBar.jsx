import React from 'react';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const handleChange = (e) => {
    setSearchQuery({
      ...searchQuery,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="search-bar">
      <div className="search-input-group">
        <FaSearch className="search-icon" />
        <input
          type="text"
          name="name"
          placeholder="Search by name..."
          value={searchQuery.name}
          onChange={handleChange}
          className="search-input"
        />
      </div>

      <input
        type="text"
        name="category"
        placeholder="Category..."
        value={searchQuery.category}
        onChange={handleChange}
        className="search-input"
      />

      <div className="price-range">
        <input
          type="number"
          name="minPrice"
          placeholder="Min price"
          value={searchQuery.minPrice}
          onChange={handleChange}
          className="search-input price-input"
          min="0"
          step="0.01"
        />
        <span className="price-separator">-</span>
        <input
          type="number"
          name="maxPrice"
          placeholder="Max price"
          value={searchQuery.maxPrice}
          onChange={handleChange}
          className="search-input price-input"
          min="0"
          step="0.01"
        />
      </div>
    </div>
  );
};

export default SearchBar;

