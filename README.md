# 📚 Book Buddy – AI-Powered Reading Tracker

Book Buddy is a full-stack web application that helps users track their reading progress, write notes, get AI-generated summaries and reviews, and receive personalized book recommendations.

---

## 🚀 Features

### 🔖 Core Features
- 📘 Add and manage books (title, author, genre, progress, rating)
- 🧠 AI-powered summary generation from your notes
- 📝 AI-based review based on your rating and notes
- 📊 Visual stats and reading analytics with charts
- 🔍 Autofill book details using ISBN via OpenLibrary API
- 📚 Book recommendations based on reading history

---

## ⚙️ Setup Instructions

### 🔧 Backend (Python + Flask + SQLite)
1. **Install Python 3.10.13** (important for TensorFlow compatibility)
2. Create and activate virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # macOS/Linux
   venv\Scripts\activate     # Windows
   ```
3. **Install dependencies:**
   ```bash
   pip install -r backend/requirements.txt
   ```
4. **Run the Flask server:**
   ```bash
   cd backend
   python app.py
   ```

### 🌐 Frontend (React)
1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```
2. **Run frontend in dev mode:**
   ```bash
   npm start
   ```
   OR
3. **Build frontend for production:**
   ```bash
   npm run build
   ```

---

## 🧪 API Endpoints

| Method | Endpoint                 | Description                           |
|--------|--------------------------|---------------------------------------|
| GET    | `/books`                 | Fetch all books                       |
| POST   | `/books`                 | Add a new book                        |
| PUT    | `/books/<id>`           | Update book rating or notes           |
| DELETE | `/books/<id>`           | Delete a book                         |
| GET    | `/stats`                 | Get reading statistics                |
| GET    | `/recommend/<book_id>`  | Get recommendations for a book        |
| POST   | `/summarize`            | Get AI-generated summary              |
| POST   | `/review`               | Get AI-generated review               |

---

## 📝 Technologies Used

- **Frontend**: ReactJS
- **Backend**: Flask (Python)
- **Database**: SQLite
- **ML/AI**: HuggingFace Transformers / OpenAI / TensorFlow
- **Visualization**: Recharts (React)
- **APIs**: OpenLibrary ISBN Lookup

---

## 🐞 Common Issues

- ❗ **TensorFlow not found on Render?**  
  Make sure your `runtime.txt` in the project **root** says:
  ```text
  python-3.10.13
  ```

- ❗ **Build failed on Render?**  
  Ensure `requirements.txt` is in the `backend/` folder and your Render build command is:
  ```bash
  pip install -r backend/requirements.txt
  ```

---

## 📁 Folder Structure

```
book-buddy/
├── backend/
│   ├── app.py
│   ├── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   └── build/
├── runtime.txt         ← python-3.10.13
├── README.md
```

---

## ✨ Future Improvements

- Add user login/signup and personalized dashboards
- Cloud-based database (MongoDB/Cloud SQL)
- Deploy backend and frontend with Render/Netlify/Vercel
