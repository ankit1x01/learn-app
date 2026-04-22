"""
JEE Papers Deep Analysis using all-MiniLM-L6-v2
Produces: topic clusters, cross-year repeats, subject difficulty proxy, concept heatmap
"""

import json, os, pickle, sys, numpy as np
from collections import defaultdict
from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

DB_PATH    = os.path.join(os.path.dirname(__file__), "papers_db.json")
CACHE_PATH = os.path.join(os.path.dirname(__file__), "embeddings_cache.pkl")
MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

# ── load ──────────────────────────────────────────────────────────────────────
data = json.load(open(DB_PATH, encoding="utf-8"))
questions = []
for paper in data["papers"]:
    for subj in paper["subjects"]:
        for sec in subj["sections"]:
            for q in sec["questions"]:
                questions.append({
                    "text":    q["questionText"],
                    "subject": q.get("subject", subj["name"]),
                    "year":    paper["year"],
                    "paper":   paper["paperNumber"],
                    "section": sec.get("sectionTitle", ""),
                    "type":    sec.get("questionType", ""),
                    "number":  q["questionNumber"],
                    "marks":   sec.get("markingScheme", {}).get("fullMarks", 0),
                })

print(f"Loaded {len(questions)} questions from {len(data['papers'])} papers\n")

# ── embeddings ────────────────────────────────────────────────────────────────
model = SentenceTransformer(MODEL_NAME)
texts = [q["text"] for q in questions]

if os.path.exists(CACHE_PATH):
    with open(CACHE_PATH, "rb") as f:
        cache = pickle.load(f)
    if cache.get("texts") == texts:
        embeddings = cache["embeddings"]
    else:
        embeddings = model.encode(texts, show_progress_bar=True, batch_size=64)
        pickle.dump({"texts": texts, "embeddings": embeddings}, open(CACHE_PATH, "wb"))
else:
    embeddings = model.encode(texts, show_progress_bar=True, batch_size=64)
    pickle.dump({"texts": texts, "embeddings": embeddings}, open(CACHE_PATH, "wb"))

embeddings = np.array(embeddings)

# ══════════════════════════════════════════════════════════════════════════════
# 1. PAPER STATS
# ══════════════════════════════════════════════════════════════════════════════
print("=" * 65)
print("1. PAPER & SUBJECT BREAKDOWN")
print("=" * 65)
by_year_paper = defaultdict(lambda: defaultdict(int))
for q in questions:
    by_year_paper[(q["year"], q["paper"])][q["subject"]] += 1

for (yr, pn), subs in sorted(by_year_paper.items()):
    total = sum(subs.values())
    breakdown = "  |  ".join(f"{s}: {c}" for s, c in sorted(subs.items()))
    print(f"  JEE {yr} Paper {pn}  →  {total} Qs  |  {breakdown}")

# ══════════════════════════════════════════════════════════════════════════════
# 2. QUESTION TYPE DISTRIBUTION
# ══════════════════════════════════════════════════════════════════════════════
print("\n" + "=" * 65)
print("2. QUESTION TYPE DISTRIBUTION")
print("=" * 65)
type_counts = defaultdict(int)
for q in questions:
    type_counts[q["type"]] += 1
for t, c in sorted(type_counts.items(), key=lambda x: -x[1]):
    bar = "█" * (c // 3)
    print(f"  {t:<30} {c:>4}  {bar}")

# ══════════════════════════════════════════════════════════════════════════════
# 3. TOPIC CLUSTERS  (KMeans per subject)
# ══════════════════════════════════════════════════════════════════════════════
print("\n" + "=" * 65)
print("3. SEMANTIC TOPIC CLUSTERS (per subject, k=8)")
print("=" * 65)

TOPIC_SEEDS = {
    "Mathematics": [
        "integral calculus area under curve",
        "differential equations",
        "complex numbers argument modulus",
        "matrices determinants linear algebra",
        "probability combinatorics",
        "coordinate geometry circles parabola ellipse",
        "trigonometry inverse functions",
        "sequences series limits",
    ],
    "Physics": [
        "mechanics kinematics projectile motion",
        "electricity current circuits resistance",
        "electrostatics capacitor electric field",
        "optics lens mirror refraction",
        "modern physics photoelectric effect",
        "thermodynamics heat entropy",
        "waves sound oscillation",
        "magnetic field force current",
    ],
    "Chemistry": [
        "organic reactions mechanism",
        "electrochemistry redox cell potential",
        "chemical equilibrium Kp Kc",
        "atomic structure orbitals quantum",
        "coordination compounds ligands",
        "thermodynamics enthalpy entropy Gibbs",
        "periodic table properties trends",
        "solutions colligative properties",
    ],
}

subject_clusters = {}
for subject, seeds in TOPIC_SEEDS.items():
    idx = [i for i, q in enumerate(questions) if q["subject"] == subject]
    if not idx:
        continue
    sub_emb  = embeddings[idx]
    seed_emb = model.encode(seeds)

    # assign each question to nearest seed topic
    sim = cosine_similarity(sub_emb, seed_emb)
    assignments = np.argmax(sim, axis=1)
    cluster_qs  = defaultdict(list)
    for j, q_idx in enumerate(idx):
        cluster_qs[assignments[j]].append(q_idx)

    subject_clusters[subject] = (seeds, cluster_qs)

    print(f"\n  {subject.upper()} ({len(idx)} questions)")
    for seed_id, seed_label in enumerate(seeds):
        members = cluster_qs[seed_id]
        years   = sorted({questions[i]["year"] for i in members})
        bar     = "▪" * len(members)
        print(f"    {seed_label:<45} {len(members):>3}q  {bar[:30]}  years:{years}")

# ══════════════════════════════════════════════════════════════════════════════
# 4. CROSS-YEAR SIMILAR QUESTIONS  (potential repeats / concept repeats)
# ══════════════════════════════════════════════════════════════════════════════
print("\n" + "=" * 65)
print("4. CROSS-YEAR CONCEPT REPEATS  (cosine similarity > 0.72)")
print("=" * 65)

sim_matrix  = cosine_similarity(embeddings)
np.fill_diagonal(sim_matrix, 0)

seen   = set()
repeats = []
for i in range(len(questions)):
    for j in range(i + 1, len(questions)):
        qi, qj = questions[i], questions[j]
        if qi["year"] == qj["year"]:
            continue
        if qi["subject"] != qj["subject"]:
            continue
        score = sim_matrix[i][j]
        if score > 0.72:
            key = (min(i, j), max(i, j))
            if key not in seen:
                seen.add(key)
                repeats.append((score, qi, qj))

repeats.sort(key=lambda x: -x[0])
print(f"\n  Found {len(repeats)} cross-year high-similarity pairs\n")
for score, qi, qj in repeats[:15]:
    print(f"  [{score:.3f}]  {qi['subject']}  |  {qi['year']} P{qi['paper']} Q{qi['number']}  ↔  {qj['year']} P{qj['paper']} Q{qj['number']}")
    print(f"          A: {qi['text'][:110].strip()}")
    print(f"          B: {qj['text'][:110].strip()}")
    print()

# ══════════════════════════════════════════════════════════════════════════════
# 5. MOST ISOLATED QUESTIONS  (unique — no similar question in other papers)
# ══════════════════════════════════════════════════════════════════════════════
print("=" * 65)
print("5. MOST UNIQUE / NOVEL QUESTIONS  (lowest max cross-paper similarity)")
print("=" * 65)

uniqueness = []
for i, qi in enumerate(questions):
    cross = [
        sim_matrix[i][j]
        for j, qj in enumerate(questions)
        if qj["year"] != qi["year"] and qj["subject"] == qi["subject"]
    ]
    if cross:
        uniqueness.append((max(cross), i))

uniqueness.sort(key=lambda x: x[0])
print(f"\n  Top 10 most unique questions (hardest to predict from past papers)\n")
for score, i in uniqueness[:10]:
    q = questions[i]
    print(f"  [{score:.3f}] {q['subject']} | {q['year']} P{q['paper']} Q{q['number']} | {q['type']}")
    print(f"         {q['text'][:130].strip()}")
    print()

# ══════════════════════════════════════════════════════════════════════════════
# 6. TOPIC TREND OVER YEARS
# ══════════════════════════════════════════════════════════════════════════════
print("=" * 65)
print("6. TOPIC TREND OVER YEARS  (questions per cluster per year)")
print("=" * 65)

years = sorted({q["year"] for q in questions})
for subject, (seeds, cluster_qs) in subject_clusters.items():
    print(f"\n  {subject.upper()}")
    print(f"  {'Topic':<40}" + "".join(f"  {y}" for y in years))
    print(f"  {'-'*40}" + "------" * len(years))
    for sid, label in enumerate(seeds):
        members = cluster_qs[sid]
        year_counts = {y: sum(1 for i in members if questions[i]["year"] == y) for y in years}
        row = f"  {label[:40]:<40}" + "".join(f"  {year_counts[y]:>3} " for y in years)
        print(row)

print("\n\nDone.")
