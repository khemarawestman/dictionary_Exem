/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react';

const WordDetail = ({ wordData, onAddFavorite }) => {
  const audioRef = useRef(null); // Skapa en referens för audio-elementet

  if (!wordData) return null;

  const { word, phonetics, meanings } = wordData;

  // Effekt för att uppdatera ljudkällan när wordData ändras
  useEffect(() => {
    if (audioRef.current && phonetics?.[0]?.audio) {
      audioRef.current.src = phonetics[0].audio; // Ställ in den nya ljudkällan
      audioRef.current.load(); // Ladda den nya ljudkällan
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordData]); // Kör denna effekt bara när wordData ändras

  return (
    <div className="word-detail">
      <h2>{word}</h2>

      {/* Ljud för ordet */}
      {phonetics?.[0]?.audio && (
        <audio controls data-testid="audio-element">
          <source src={phonetics[0].audio} type="audio/mpeg" />
          Din webbläsare stöder inte ljudelementet.
        </audio>
      )}

      {/* Betydelser och definitioner */}
      {meanings?.map((meaning, index) => (
        <div key={index}>
          <h4>{meaning.partOfSpeech}</h4>
          <ul>
            {meaning.definitions.map((def, idx) => (
              // Se till att hela definitionen är innesluten i en enda <li> eller <p> tagg
              <li key={idx}>{def.definition}</li>
            ))}
          </ul>
        </div>
      ))}

      {/* Knapp för att lägga till i favoriter */}
      <button onClick={() => onAddFavorite(word)}>Lägg till i favoriter</button>
    </div>
  );
};

export default WordDetail;
