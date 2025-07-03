# 📚 Book Buddy 

Book Buddy is a full-stack web application that helps users track their reading progress, write notes, get AI-generated summaries and reviews, and receive personalized book recommendations.



### 🔖 Core Features
- 📘 Add and manage books (title, author, genre, progress, rating)
- 🧠 AI-powered summary generation from your notes
- 📝 AI-based review based on your rating and notes
- 📊 Visual stats and reading analytics with charts
- 🔍 Autofill book details using ISBN via OpenLibrary API
- 📚 Book recommendations based on reading history
-    Stores all datas in sqlite



## ⚙️ Setup Instructions

### 🔧 Backend (Python + Flask + SQLite)
1. **Install Python 3.10.13** (important for TensorFlow compatibility)
2. Create and activate virtual environment:
   python -m venv venv
   venv\Scripts\activate     # Windows
   ```
3. **Install dependencies:**
   pip install -r backend/requirements.txt
   ```
4. **Run the Flask server:**
   cd backend
   python app.py
   ```

### 🌐 Frontend (React)
1. **Install dependencies:**
   cd frontend
   npm install
   ```
2. **Run frontend in dev mode:**
   npm start
   ```
   OR
3. **Build frontend for production:**
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


- ❗ **Build failed on Render?**  
  Ensure `requirements.txt` is in the `backend/` folder and your Render build command is:
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


