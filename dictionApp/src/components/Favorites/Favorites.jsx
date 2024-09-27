/* eslint-disable react/prop-types */
const Favorites = ({ favorites, onRemoveFavorite }) => {
  // Om inga favoriter är sparade, visa meddelande
  if (favorites.length === 0) {
    return <p>Inga favoritord har sparats ännu.</p>;
  }

  return (
    <div className="favorites">
      <h2>Favoritord</h2>
      <ul>
        {favorites.map((word, index) => (
          <li key={index} className="favorite-item">
            {word} 
            {/* Knapp för att ta bort ord från favoriter */}
            <button onClick={() => onRemoveFavorite(word)}>Ta bort</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favorites;
