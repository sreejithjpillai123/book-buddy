import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const API = 'http://localhost:5000';

function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    isbn: '',
    title: '',
    author: '',
    genre: '',
    status: 'reading',
    progress: 'Progress %',
    rating: 'Rating (1-5)'
  });

  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState({});
  const [reviews, setReviews] = useState({}); // 🆕 for storing AI reviews

  const getBooks = () => {
    axios.get(`${API}/books`).then(res => setBooks(res.data));
  };

  const getStats = () => {
    axios.get(`${API}/stats`).then(res => setStats(res.data));
  };

  const handleAdd = () => {
    axios.post(`${API}/books`, form).then(() => {
      getBooks();
      getStats();
      setForm({
        isbn: '',
        title: '',
        author: '',
        genre: '',
        status: 'reading',
        progress: 0,
        rating: 0
      });
    });
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const fetchRecommendations = (bookId) => {
    axios.get(`${API}/recommend/${bookId}`)
      .then(res => {
        setRecommendations(prev => ({ ...prev, [bookId]: res.data }));
      })
      .catch(err => console.error("Error fetching recommendations:", err));
  };

  const handleRatingSave = (bookId, rating) => {
    axios.put(`${API}/books/${bookId}`, { rating }).then(() => {
      getBooks();
    });
  };

  useEffect(() => {
    getBooks();
    getStats();
  }, []);

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center' }}>📚 Book Buddy</h1>


      <h3>Add New Book</h3>
      <input
        name="isbn"
        placeholder="ISBN (optional)"
        value={form.isbn}
        onChange={handleChange}
      />
      <button
        onClick={() => {
          if (!form.isbn) return alert("Please enter an ISBN");
          axios.get(`https://openlibrary.org/isbn/${form.isbn}.json`)
            .then(res => {
              const bookData = res.data;
              setForm(prev => ({
                ...prev,
                title: bookData.title || prev.title,
                author: (bookData.authors && bookData.authors.length > 0)
                  ? bookData.authors.map(a => a.name).join(', ')
                  : prev.author
              }));
            })
            .catch(() => alert("Book not found or invalid ISBN"));
        }}
      >
        Autofill by ISBN
      </button>
      <br />
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} /><br />
      <input name="author" placeholder="Author" value={form.author} onChange={handleChange} /><br />
      <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} /><br />
      <select name="status" value={form.status} onChange={handleChange}>
        <option value="reading">Reading</option>
        <option value="completed">Completed</option>
        <option value="wishlist">Wishlist</option>
      </select><br />
      <input
        name="progress"
        type="number"
        placeholder="Progress (%)"
        min="0"
        max="100"
        value={form.progress}
        onChange={handleChange}
      /><br />
      <input
        name="rating"
        type="number"
        placeholder="Rating (1–5)"
        min="1"
        max="5"
        value={form.rating}
        onChange={handleChange}
      /><br />
      <button onClick={handleAdd}>Add Book</button>

      <h3>📖 Book List</h3>
      <ul>
        {books.map(book => (
          <li key={book.id} className="book-item">
            <b>{book.title}</b> by {book.author} [{book.status}]<br />
            Progress: {book.progress}%<br />

            <textarea
              rows={3}
              cols={40}
              placeholder="Write your thoughts or summary here..."
              value={book.newNote !== undefined ? book.newNote : book.notes || ""}
              onChange={(e) => {
                const updatedBooks = books.map(b =>
                  b.id === book.id ? { ...b, newNote: e.target.value } : b
                );
                setBooks(updatedBooks);
              }}
            /><br />

            <button
              onClick={() => {
                const updatedBook = books.find(b => b.id === book.id);
                axios.put(`${API}/books/${book.id}`, {
                  notes: updatedBook.newNote || "",
                  rating: updatedBook.rating || 0
                }).then(() => {
                  alert("Note saved!");
                  getBooks();
                });
              }}
            >
              Save Note
            </button>

            <button
              style={{ marginLeft: '10px', backgroundColor: '#3498db', color: 'white' }}
              onClick={() => {
                const userNote = book.newNote || book.notes;
                if (!userNote) {
                  alert("Note is empty!");
                  return;
                }

                axios.post(`${API}/summarize`, { note: userNote })
                  .then(res => {
                    const updatedBooks = books.map(b =>
                      b.id === book.id ? { ...b, summary: res.data.summary } : b
                    );
                    setBooks(updatedBooks);
                  })
                  .catch(err => {
                    alert("Error generating summary");
                    console.error(err);
                  });
              }}
            >
              Generate Summary
            </button>

            {/* 🧠 Generate AI Review */}
            <button
              style={{ marginLeft: '10px', backgroundColor: '#9b59b6', color: 'white' }}
              onClick={() => {
                const userNote = book.newNote || book.notes;
                if (!userNote || !book.rating) {
                  alert("Both note and rating are required to generate a review.");
                  return;
                }

                axios.post(`${API}/review`, {
                  note: userNote,
                  rating: book.rating
                })
                  .then(res => {
                    setReviews(prev => ({ ...prev, [book.id]: res.data.review }));
                  })
                  .catch(err => {
                    alert("Error generating review");
                    console.error(err);
                  });
              }}
            >
              📝 Generate Review
            </button>

            <button
              style={{ marginLeft: '10px', backgroundColor: 'green', color: 'white' }}
              onClick={() => fetchRecommendations(book.id)}
            >
              📚 Recommend Similar
            </button>

            <button
              style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}
              onClick={() => {
                if (window.confirm(`Delete "${book.title}"?`)) {
                  axios.delete(`${API}/books/${book.id}`).then(() => {
                    alert("Book deleted!");
                    getBooks();
                    getStats();
                  });
                }
              }}
            >
              Delete
            </button>

            <br />
            Summary: {book.summary || book.notes || "No notes yet."}

            {/* ⭐ Star Rating UI */}
            <div style={{ marginTop: '8px' }}>
              Rating:
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  onClick={() => {
                    const updatedBooks = books.map(b =>
                      b.id === book.id ? { ...b, rating: star } : b
                    );
                    setBooks(updatedBooks);
                    handleRatingSave(book.id, star);
                  }}
                  style={{
                    cursor: 'pointer',
                    fontSize: '22px',
                    color: (book.rating || 0) >= star ? '#FFD700' : '#CCC'
                  }}
                >
                  ★
                </span>
              ))}
            </div>

            {/* 💬 Show AI-generated review */}
            {reviews[book.id] && (
              <p style={{ fontStyle: 'italic', color: '#555' }}>
                <b>AI Review:</b> {reviews[book.id]}
              </p>
            )}

            {/* 📚 Show Recommendations */}
            {recommendations[book.id] && (
              <div style={{ marginTop: '10px' }}>
                <b>Recommended Books:</b>
                <ul>
                  {recommendations[book.id].map(r => (
                    <li key={r.id}>{r.title} by {r.author}</li>
                  ))}
                </ul>
              </div>
            )}
            <hr />
          </li>
        ))}
      </ul>

      <h3>📊 Stats</h3>
      {stats && (
        <>
          <p>Total Books: {stats.total}</p>
          <p>Completed: {stats.completed}</p>
          <p>Completed %: {stats.percent_completed.toFixed(2)}%</p>
          <p>Books by Genre:</p>
          <ul>
            {Object.entries(stats.books_by_genre).map(([genre, count]) => (
              <li key={genre}>{genre}: {count}</li>
            ))}
          </ul>
        </>
      )}

      {books.length > 0 && (
  <>
    <h4>📈 Reading Progress Over Time</h4>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={books.map(book => ({
        date: new Date(book.date_added).toLocaleDateString(),
        progress: book.progress
      }))}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Line type="monotone" dataKey="progress" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  </>
)}

    </div>
  );
}

export default App;
