/* eslint-disable no-undef */
import { render, screen, fireEvent } from '@testing-library/react';
import DictionaryApp from './DictionaryApp';
import { vi } from 'vitest';
// Mocka fetch-funktionen globalt
global.fetch = vi.fn((url) => {
  if (url.includes('drink')) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            word: 'drink',
            meanings: [
              {
                partOfSpeech: 'noun',
                definitions: [
                  {
                    definition:
                      'A liquid that can be swallowed as refreshment or nourishment.',
                  },
                ],
              },
            ],
          },
        ]),
    });
  } else {
    return Promise.resolve({
      ok: false,
      status: 404,
      json: () =>
        Promise.resolve({
          title: 'No Definitions Found',
          message: '...',
          resolution: '...',
        }),
    });
  }
});
// Testar att söka efter ordet "drink" och visar resultatet
test('searches for the word "drink" and displays the result', async () => {
  render(<DictionaryApp />);
  // Hämta inmatningsfältet 
  const inputElement = screen.getByPlaceholderText(/enter a word/i);
  const searchButton = screen.getByText(/search/i);

  fireEvent.change(inputElement, { target: { value: 'drink' } });
  fireEvent.click(searchButton);
  // Kontrollera att ordets detaljer visas
  const resultElement = await screen.findByRole('heading', { name: /drink/i });
  expect(resultElement).toBeInTheDocument();

  const definitionElement = await screen.findByText(
    /A liquid that can be swallowed as refreshment or nourishment./i
  );
  expect(definitionElement).toBeInTheDocument();
});
// Testar att växla mellan ljust och mörkt tema
test('toggles between light and dark themes', () => {
  render(<DictionaryApp />);

  const toggleButton = screen.getByText(/växla till mörkt läge/i);

  expect(document.body.classList.contains('dark-theme')).toBe(false);

  fireEvent.click(toggleButton);
  expect(document.body.classList.contains('dark-theme')).toBe(true);
  expect(screen.getByText(/växla till ljust läge/i)).toBeInTheDocument();

  fireEvent.click(screen.getByText(/växla till ljust läge/i));
  expect(document.body.classList.contains('dark-theme')).toBe(false);
});
// Testar att favoriter laddas från localStorage

test('loads favorites from local storage', () => {
  localStorage.setItem('favorites', JSON.stringify(['drink']));

  render(<DictionaryApp />);

  const favoriteWord = screen.getByText(/drink/i);
  expect(favoriteWord).toBeInTheDocument();
});
// Testar att temat laddas från localStorage

test('loads theme from local storage', () => {
  localStorage.setItem('theme', 'dark');

  render(<DictionaryApp />);

  expect(document.body.classList.contains('dark-theme')).toBe(true);
});
