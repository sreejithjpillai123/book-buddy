# 📚 Book Buddy 

Book Buddy is a full-stack web application that helps users track their reading progress, write notes, get AI-generated summaries and reviews, and receive personalized book recommendations.

![Dashboard Screenshot](images/image1.png) 

### 🔖 Core Features
- 📘 Add and manage books (title, author, genre, progress, rating)
- 🧠 AI-powered summary generation from your notes
- 📝 AI-based review based on your rating and notes
- 📊 Visual stats and reading analytics with charts
- 🔍 Autofill book details using ISBN via OpenLibrary API
- 📚 Book recommendations based on reading history
-    Stores all datas in sqlite

![Dashboard Screenshot](images/image2.png) 
![Dashboard Screenshot](images/image4.png) 


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

![Dashboard Screenshot](images/image3.png) 

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

