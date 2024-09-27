/* eslint-disable no-undef */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WordDetail from './WordDetail';
import { vi } from 'vitest';

// Mockar fetch för att hämta data direkt från API:t
const fetchWordData = async (word) => {
  const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
  const data = await response.json();
  return data[0];
};

test('renderar ljudet om det finns tillgängligt', async () => {
  // Hämtar riktig data från API:t
  const wordData = await fetchWordData('hello');

  render(<WordDetail wordData={wordData} onAddFavorite={() => {}} />);

  // Väntar på att ljud-elementet ska visas
  await waitFor(() => {
    const audioElement = screen.getByTestId('audio-element');
    expect(audioElement).toBeInTheDocument();
    expect(audioElement.querySelector('source')).toHaveAttribute('src', wordData.phonetics[0].audio);
  });
});

test('hanterar saknad fonetik på ett smidigt sätt', async () => {
  // Hämtar riktig data och tar bort fonetiken manuellt
  const wordData = await fetchWordData('hello');
  const wordDataWithoutPhonetics = { ...wordData, phonetics: [] };

  render(<WordDetail wordData={wordDataWithoutPhonetics} onAddFavorite={() => {}} />);

  // Kontrollera att inget ljud-element renderas
  const audioElement = screen.queryByTestId('audio-element');
  expect(audioElement).not.toBeInTheDocument();
});

test('hanterar saknade betydelser på ett smidigt sätt', async () => {
  const wordData = await fetchWordData('hello');
  const wordDataWithoutMeanings = { ...wordData, meanings: [] };

  render(<WordDetail wordData={wordDataWithoutMeanings} onAddFavorite={() => {}} />);

  // Kontrollera att inga betydelser renderas
  const meaningElement = screen.queryByText(/noun/i);
  expect(meaningElement).not.toBeInTheDocument();
});

test('anropar onAddFavorite när knappen klickas', async () => {
  const addFavoriteMock = vi.fn();
  const wordData = await fetchWordData('hello');

  render(<WordDetail wordData={wordData} onAddFavorite={addFavoriteMock} />);

  // Simulera klick på knappen "Lägg till i favoriter" med getByText
  const addButton = screen.getByText(/Lägg till i favoriter/i);
  fireEvent.click(addButton);

  expect(addFavoriteMock).toHaveBeenCalledWith('hello');
});
