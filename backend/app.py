from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import cohere
import requests
from datetime import datetime

# ✅ Flask app and DB config
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
db = SQLAlchemy(app)

# ✅ Cohere AI Key
cohere_client = cohere.Client("5VmAzPgv216bY6aCv7h6Xibqcf1hIUp6heeG6tu1")

# ✅ Book Model
class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    author = db.Column(db.String(100))
    genre = db.Column(db.String(50))
    status = db.Column(db.String(20))
    progress = db.Column(db.Integer, default=0)
    notes = db.Column(db.Text)
    rating = db.Column(db.Integer)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)  # ⭐ Rating added

# ✅ Get All Books
@app.route('/books', methods=['GET'])
def get_books():
    books = Book.query.all()
    return jsonify([{
        "id": b.id,
        "title": b.title,
        "author": b.author,
        "genre": b.genre,
        "status": b.status,
        "progress": b.progress,
        "notes": b.notes,
        "rating": b.rating,
        "date_added": b.date_added.strftime("%Y-%m-%d")
    } for b in books])

# ✅ Add Book
@app.route('/books', methods=['POST'])
def add_book():
    data = request.get_json()
    new_book = Book(
        title=data['title'],
        author=data['author'],
        genre=data['genre'],
        status=data['status'],
        progress=data.get('progress', 0),
        rating=data.get('rating', 0)  # ⭐ Accept rating from frontend
    )
    db.session.add(new_book)
    db.session.commit()
    return jsonify({"message": "Book added"}), 201

# ✅ Update Book
@app.route('/books/<int:id>', methods=['PUT'])
def update_book(id):
    data = request.get_json()
    book = Book.query.get(id)
    if not book:
        return jsonify({"error": "Book not found"}), 404

    book.progress = data.get('progress', book.progress)
    book.status = data.get('status', book.status)
    book.notes = data.get('notes', book.notes)
    book.rating = data.get('rating', book.rating)  # ⭐ Update rating
    db.session.commit()
    return jsonify({"message": "Book updated"})

# ✅ Delete Book
@app.route('/books/<int:id>', methods=['DELETE'])
def delete_book(id):
    book = Book.query.get(id)
    if not book:
        return jsonify({"error": "Book not found"}), 404
    db.session.delete(book)
    db.session.commit()
    return jsonify({"message": "Book deleted"})

# ✅ Reading Stats
@app.route('/stats', methods=['GET'])
def get_stats():
    total = Book.query.count()
    completed = Book.query.filter_by(status='completed').count()
    by_genre = db.session.query(Book.genre, db.func.count(Book.id)).group_by(Book.genre).all()
    return jsonify({
        "total": total,
        "completed": completed,
        "percent_completed": (completed / total * 100) if total else 0,
        "books_by_genre": dict(by_genre)
    })

# ✅ Summarize Note Using Cohere
@app.route('/summarize', methods=['POST'])
def summarize_note():
    data = request.get_json()
    note = data.get('note', '').strip()
    print("Note received from frontend:", note)

    if not note:
        return jsonify({"error": "Empty note"}), 400

    if len(note) < 250:
        return jsonify({"summary": "Note too short for AI summarization. Here's the original: " + note})

    try:
        response = cohere_client.summarize(
            text=note,
            length="short",
            format="paragraph",
            extractiveness="medium"
        )
        summary = response.summary
        return jsonify({"summary": summary})

    except Exception as e:
        print("Cohere Error:", e)
        return jsonify({"error": "Summary generation failed"}), 500

# ✅ Genre-Based Book Recommendation Using Google Books API
GOOGLE_BOOKS_API_KEY = "AIzaSyAb3GbO_TfILxQPp1IlAAvom52QJ3sThq8"

@app.route('/recommend/<int:book_id>', methods=['GET'])
def recommend_books(book_id):
    current_book = Book.query.get(book_id)
    if not current_book:
        return jsonify({"error": "Book not found"}), 404

    genre = current_book.genre
    try:
        response = requests.get(
            "https://www.googleapis.com/books/v1/volumes",
            params={
                "q": f"subject:{genre}",
                "key": GOOGLE_BOOKS_API_KEY,
                "maxResults": 5
            }
        )
        data = response.json()

        recommendations = []
        for item in data.get("items", []):
            volume = item["volumeInfo"]
            recommendations.append({
                "title": volume.get("title"),
                "author": ", ".join(volume.get("authors", [])),
                "description": volume.get("description", "No description"),
                "genre": genre
            })

        return jsonify(recommendations)
    except Exception as e:
        print("Google Books API Error:", e)
        return jsonify({"error": "Recommendation failed"}), 500

@app.route('/review', methods=['POST'])
def generate_review():
    data = request.get_json()
    note = data.get("note", "").strip()
    rating = data.get("rating", None)

    if not note or not rating:
        return jsonify({"error": "Note and rating are required"}), 400

    if len(note) < 100:
        return jsonify({"review": "Note too short to generate a meaningful review."})

    try:
        response = cohere_client.generate(
            prompt=f"""You are a book reviewer. Based on the user's note and rating, write a short review in 2-3 sentences.

Note: "{note}"
Rating: {rating}/5

Review:""",
            max_tokens=100,
            temperature=0.7
        )
        review_text = response.generations[0].text.strip()
        return jsonify({"review": review_text})
    except Exception as e:
        print("Cohere Review Error:", e)
        return jsonify({"error": "Failed to generate review"}), 500



# ✅ Run Flask app
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
