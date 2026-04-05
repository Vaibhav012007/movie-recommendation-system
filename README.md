<<<<<<< HEAD
<<<<<<< HEAD
# 🎬 Movie Recommendation System

## 📌 1. Project Overview

The **Movie Recommendation System** is a machine learning-based web application that suggests movies similar to a selected movie using **content-based filtering** and advanced text vectorization techniques.

---

## 🎯 2. Objective

* Recommend movies based on similarity
* Improve content discovery
* Apply NLP techniques in real-world systems

---

## 🧠 3. Methodology

### 🔹 Approach: Content-Based Filtering

* Uses movie metadata to compute similarity
* Focuses on:

  * Genres
  * Keywords
  * Cast
  * Crew

---

### 🔹 Pipeline:

1. Data Collection
2. Data Cleaning
3. Feature Engineering
4. TF-IDF Vectorization
5. Similarity Computation
6. Recommendation Output

---

## 📂 4. Dataset

* **TMDB 5000 Movies Dataset**
* Includes:

  * Title
  * Overview
  * Genres
  * Cast & Crew
  * Keywords

---

## ⚙️ 5. Technologies Used

* Python
* Pandas, NumPy
* Scikit-learn
* Streamlit
* Pickle

---

## 🔍 6. Working of the System

### Step 1: Data Preprocessing

* Remove null values
* Extract relevant columns
* Convert JSON-like structures

---

### Step 2: Feature Engineering

* Combine features into a single column:

```
tags = genres + keywords + cast + crew
```

---

### Step 3: Text Vectorization (IMPORTANT UPDATE ✅)

* Used **TF-IDF Vectorizer** instead of CountVectorizer
* Captures importance of words using frequency weighting
* Reduces impact of common words

👉 Why TF-IDF is better:

* Gives more importance to unique words
* Improves recommendation quality
* Handles noise better than raw counts

---

### Step 4: Similarity Calculation

* Used **Cosine Similarity** on TF-IDF vectors
* Finds similarity between movies

---

## 🧮 7. Algorithm Used

### Cosine Similarity:

```
cos(θ) = (A · B) / (|A| |B|)
```

---

## 💻 8. Core Implementation

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

tfidf = TfidfVectorizer(max_features=5000, stop_words='english')
vectors = tfidf.fit_transform(movies['tags']).toarray()

similarity = cosine_similarity(vectors)
```

---

## 🌐 9. Web Application

👉 **Live App:**

```
https://movie-recommendation-website-ljzbxvekizuucc9vhebg3x.streamlit.app/
```

*(Replace with your actual deployed link — if you give it to me, I’ll format it perfectly)*

---

### Features:

* Select a movie
* Get top 5 recommendations
* Displays posters using TMDB API

---

## 🚀 10. Key Features

* Uses **TF-IDF for better semantic understanding**
* Fast and efficient recommendations
* Clean Streamlit UI
* Real-time results

---

## 📊 Evaluation

To ensure meaningful recommendations, heuristic evaluation metrics were used:

- **Precision@5**
  - Relaxed (≥1 genre overlap): **0.84**
  - Strict (≥2 genre overlap): **0.32**

- **Diversity**: **0.87**  
- **Average Similarity Score**: **0.21**

> Note: Relevance was approximated using genre overlap between recommended and query movies. While not perfect, this provides a reasonable offline evaluation for a content-based system without user interaction data.

---

## 📊 13. Applications

* OTT platforms
* Content platforms
* Personalized recommendation engines

---

## 📌 14. Conclusion

This project demonstrates how **TF-IDF vectorization combined with cosine similarity** can effectively power a recommendation system. It highlights the role of NLP in building scalable and intelligent applications.


=======
# movie-recommendation-system
>>>>>>> 4b76b1e9026b62cc1ec8b4df41f24ff9281e708c
=======
# movie-recommendation-system
>>>>>>> 4b76b1e9026b62cc1ec8b4df41f24ff9281e708c
