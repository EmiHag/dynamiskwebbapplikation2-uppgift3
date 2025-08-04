import React, { useState } from 'react';
import './App.css';

function ResultTable({ books, onBookSelect, numFound }) {
  return (
    <div>
      <p>Totalt antal funna böcker: {numFound}</p>
      <table>
        <thead>
          <tr>
            <th>Författare</th>
            <th>Titel</th>
            <th>Första utgivningsår</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <tr key={index} onClick={() => onBookSelect(book)}>
              <td>{book.author_name ? book.author_name[0] : 'Unknown'}</td>
              <td>{book.title}</td>
              <td>{book.first_publish_year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BookDetail({ book, onBack }) {
  return (
    <div>
      <button onClick={onBack}>Tillbaka till listan</button>
      <h2>Book Detaljer</h2>
      <p>Författare: {book.author_name ? book.author_name.join(', ') : 'Unknown'}</p>
      <p>Titel: {book.title}</p>
      <p>Publicerare: {book.publisher ? book.publisher.join(', ') : 'Unknown'}</p>
      <p>Språk: {book.language ? book.language.join(', ') : 'Unknown'}</p>
      <p>Ämnen: {book.subject ? book.subject.join(', ') : 'Unknown'}</p>
      {book.cover_i && (
  <img src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`} alt="Book Cover" />
)}
    </div>
  );
}


export default function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [numFound, setNumFound] = useState(0);

  const handleSearch = () => {
    fetch(`https://openlibrary.org/search.json?${searchType}=${query}`)
      .then(response => response.json())
      .then(data => {
        const books = data.docs.slice(0, 30);
        setSearchResults(books);
        setNumFound(data.numFound);
        setSelectedBook(null);
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book);
  };

  const handleBackToList = () => {
    setSelectedBook(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="App">
      <h1>Boklista</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Sök bok..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select onChange={(e) => setSearchType(e.target.value)}>
          <option value="title">Titel</option>
          <option value="author">Författare</option>
          <option value="subject">Ämne</option>
        </select>
        <button type="submit">Sök</button>
      </form>
      {selectedBook ? (
        <BookDetail book={selectedBook} onBack={handleBackToList} />
      ) : (
        <ResultTable books={searchResults} onBookSelect={handleBookSelect} numFound={numFound} />
      )}
    </div>
  );
}
