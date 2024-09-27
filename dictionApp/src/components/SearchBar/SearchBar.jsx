/* eslint-disable react/prop-types */
import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Funktion för att hantera sökningen
  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      alert("Sökrutan får inte vara tom!"); // Varning om sökfältet är tomt
    } else {
      onSearch(searchTerm); // Kör sökningen om input inte är tom
    }
  };

  return (
    <div className="search-bar">
      {/* Input-fält för att mata in ett ord */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Enter a word"
      />
      {/* Knapp för att söka */}
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
