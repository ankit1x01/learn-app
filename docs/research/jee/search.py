"""
JEE Papers Semantic Search
Usage: python search.py "your query here"
       python search.py "integration by parts" --subject Mathematics
       python search.py "electric field" --subject Physics --top 10
"""

import json
import numpy as np
import argparse
import os
import pickle
import sys
from sentence_transformers import SentenceTransformer

# Windows console unicode fix
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

DB_PATH = os.path.join(os.path.dirname(__file__), "papers_db.json")
CACHE_PATH = os.path.join(os.path.dirname(__file__), "embeddings_cache.pkl")
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"


def load_questions():
    data = json.load(open(DB_PATH, encoding="utf-8"))
    questions = []
    for paper in data["papers"]:
        for subj in paper["subjects"]:
            for sec in subj["sections"]:
                for q in sec["questions"]:
                    questions.append({
                        "text": q["questionText"],
                        "subject": q.get("subject", subj["name"]),
                        "year": paper["year"],
                        "paper": paper["paperNumber"],
                        "section": sec.get("sectionTitle", ""),
                        "type": sec.get("questionType", ""),
                        "number": q["questionNumber"],
                    })
    return questions


def load_or_build_embeddings(questions, model):
    texts = [q["text"] for q in questions]

    if os.path.exists(CACHE_PATH):
        with open(CACHE_PATH, "rb") as f:
            cache = pickle.load(f)
        if cache.get("texts") == texts:
            print("Using cached embeddings.")
            return cache["embeddings"]

    print(f"Encoding {len(texts)} questions... (first run only)")
    embeddings = model.encode(texts, show_progress_bar=True, batch_size=64)

    with open(CACHE_PATH, "wb") as f:
        pickle.dump({"texts": texts, "embeddings": embeddings}, f)

    return embeddings


def search(query, questions, embeddings, model, subject=None, top_k=5):
    if subject:
        indices = [i for i, q in enumerate(questions) if q["subject"].lower() == subject.lower()]
        filtered_q = [questions[i] for i in indices]
        filtered_emb = embeddings[indices]
    else:
        filtered_q = questions
        filtered_emb = embeddings

    query_emb = model.encode([query])
    scores = np.dot(filtered_emb, query_emb.T).flatten()
    top_indices = np.argsort(scores)[::-1][:top_k]

    results = []
    for i in top_indices:
        results.append({**filtered_q[i], "score": float(scores[i])})
    return results


def main():
    parser = argparse.ArgumentParser(description="Semantic search over JEE questions")
    parser.add_argument("query", help="Search query")
    parser.add_argument("--subject", "-s", choices=["Mathematics", "Physics", "Chemistry"], help="Filter by subject")
    parser.add_argument("--top", "-n", type=int, default=5, help="Number of results (default: 5)")
    args = parser.parse_args()

    print(f"Loading model: {MODEL_NAME}")
    model = SentenceTransformer(MODEL_NAME)

    questions = load_questions()
    embeddings = load_or_build_embeddings(questions, model)

    results = search(args.query, questions, embeddings, model, subject=args.subject, top_k=args.top)

    print(f"\n--- Top {args.top} results for: \"{args.query}\" ---\n")
    for rank, r in enumerate(results, 1):
        subj_label = f"[{r['subject']}]"
        meta = f"JEE {r['year']} P{r['paper']} | Q{r['number']} | {r['type']} | {r['section']}"
        print(f"{rank}. {subj_label} {meta}  (score: {r['score']:.3f})")
        print(f"   {r['text'][:200].strip()}")
        print()


if __name__ == "__main__":
    main()
