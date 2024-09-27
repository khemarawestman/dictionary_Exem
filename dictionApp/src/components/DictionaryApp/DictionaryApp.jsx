import { useState, useEffect } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import WordDetail from '../WordDetail/WordDetail';
import Favorites from '../Favorites/Favorites';

const DictionaryApp = () => {
  const [wordData, setWordData] = useState(null);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(false); // Loading state

  // Ladda favoriter från localStorage och temat från localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
      document.body.classList.toggle('dark-theme', storedTheme === 'dark');
    }
  }, []);

  // Hämta orddata med Fetch API
  const fetchWordData = async (word) => {
    setLoading(true);
    setWordData(null);
    setError('');

    if (!word.trim()) {
      setError("Sökrutan får inte vara tom!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      
      if (!response.ok) {
        throw new Error('Ordet hittades inte');
      }

      const data = await response.json();
      setWordData(data[0]);
      setError('');
    } catch (error) {
      setError('Ordet hittades inte');
    } finally {
      setLoading(false);
    }
  };
  
  const addFavorite = (word) => {
    if (!favorites.includes(word)) {
      const updatedFavorites = [...favorites, word];
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
  };

  const removeFavorite = (word) => {
    const updatedFavorites = favorites.filter(fav => fav !== word);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.classList.toggle('dark-theme', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div>
      <h1>Dictionary App</h1>
      <button onClick={toggleTheme}>
        Växla till {theme === 'light' ? 'Mörkt' : 'Ljust'} läge
      </button>
      <SearchBar onSearch={fetchWordData} />
      {error && <p data-testid="error-message" style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading...</p>}
      {wordData && <WordDetail wordData={wordData} onAddFavorite={addFavorite} />}
      <Favorites favorites={favorites} onRemoveFavorite={removeFavorite} />
    </div>
  );
};

export default DictionaryApp;
