import json
from collections import Counter
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans

# 1. FULL TAXONOMY (Unit -> Subtopics)
TAXONOMY = {
    "Unit 1: MP History & Culture": {
        "MP History": ["paramara", "holkar", "bundela", "dynasty", "revolt", "chandela", "scindia", "begum", "bhopal"],
        "MP Culture": ["festival", "dance", "tribe", "folk", "bhagoria", "art", "craft", "painting"],
        "MP Literature": ["writer", "poet", "book", "kalidas", "bhavabhuti", "makhanlal"]
    },
    "Unit 2: Indian History": {
        "Ancient History": ["vedic", "harappa", "maurya", "gupta", "buddhism", "jainism"],
        "Medieval History": ["mughal", "sultanate", "shivaji", "maratha", "vijayanagara"],
        "Modern History": ["british", "congress", "gandhi", "act of", "movement", "revolt of 1857", "viceroy"]
    },
    "Unit 3: MP Geography": {
        "Rivers & Water": ["narmada", "tapti", "betwa", "chambal", "son", "river", "project", "dam"],
        "Geography": ["malwa", "vindhya", "satpura", "soil", "climate", "forest"],
        "National Parks": ["kanha", "bandhavgarh", "pench", "panna", "park", "sanctuary"],
        "Tribes & Demographics": ["bhil", "gond", "baiga", "sahariya", "population", "census", "literacy"]
    },
    "Unit 4: India/World Geography": {
        "Indian Geography": ["monsoon", "soil", "himalaya", "river", "state", "crop"],
        "World Geography": ["plate", "climate", "ocean", "continent", "strait", "desert"]
    },
    "Unit 5: Polity": {
        "Fundamental Rights": ["article", "right", "freedom", "fundamental", "duty"],
        "Parliament & Executive": ["lok sabha", "rajya sabha", "president", "governor", "prime minister", "chief minister"],
        "Judiciary": ["supreme court", "high court", "judge", "writ"],
        "Amendments": ["amendment", "constitution", "schedule", "panchayat"]
    },
    "Unit 6: Economy": {
        "Economy Basics": ["gdp", "inflation", "five year plan", "poverty"],
        "Banking & Finance": ["rbi", "repo rate", "bank", "sebi", "nabard"],
        "Budget & Schemes": ["budget", "fiscal", "scheme", "yojana", "mission"]
    },
    "Unit 7: Science & Environment": {
        "Biology & Health": ["cell", "dna", "vitamin", "disease", "blood", "vaccine", "nutrition"],
        "Physics & Chemistry": ["force", "energy", "light", "sound", "element", "gas", "metal"],
        "Environment": ["biodiversity", "climate", "pollution", "gas", "greenhouse", "ozone"],
        "Space & Tech": ["isro", "satellite", "space", "drdo", "missile"]
    },
    "Unit 8: ICT": {
        "Computer Basics": ["cpu", "memory", "software", "hardware", "byte", "ram"],
        "Internet & Protocol": ["protocol", "ip", "www", "web", "html", "http"],
        "Cyber Security": ["encryption", "firewall", "virus", "malware", "hacker"],
        "Emerging Tech": ["ai", "artificial intelligence", "robot", "robotics", "e-commerce", "e-governance"]
    },
    "Unit 9: Current & Sports": {
        "Current Affairs": ["summit", "conference", "award", "padma", "nobel", "index", "report"],
        "Sports": ["olympics", "cricket", "world cup", "sports", "trophy", "player", "game"]
    },
    "Unit 10: Commissions": {
        "Constitutional Bodies": ["election commission", "cag", "upsc", "mppsc", "finance commission", "gst"],
        "Non-Constitutional": ["niti aayog", "human rights", "information commission", "women commission", "st commission", "sc commission", "cbi"]
    }
}

def tag_question(question_text):
    question_lower = question_text.lower()
    for unit, subtopics in TAXONOMY.items():
        for subtopic, keywords in subtopics.items():
            for keyword in keywords:
                if keyword in question_lower:
                    return unit, subtopic, keyword
    return "Unclassified", "Unclassified", None

def run_ml_pipeline():
    print("Loading Extracted Question Base...")
    with open("scratch/master_qbank.json", "r", encoding="utf-8") as f:
        data = json.load(f)
        
    print(f"Total Database: {len(data)} pristine MCQs")
    
    # -----------------------------------------------------------------
    # STAGE 2: HYBRID RULE TAGGER
    # -----------------------------------------------------------------
    print("Applying Level 2 Taxonomy Tagging...")
    parsed_data = []
    unit_distribution = Counter()
    
    for q in data:
        unit, subtopic, kw = tag_question(q["question"])
        parsed_data.append({
            "year": q["year"],
            "question": q["question"],
            "options": q["options"],
            "unit": unit,
            "subtopic": subtopic,
            "matched_keyword": kw
        })
        unit_distribution[unit] += 1
        
    # -----------------------------------------------------------------
    # STAGE 3: ML CLUSTERING
    # -----------------------------------------------------------------
    print("\nInitializing Machine Learning NLP Layer (TF-IDF + K-Means)...")
    corpus = [q["question"] for q in parsed_data]
    
    vectorizer = TfidfVectorizer(stop_words='english', max_features=500)
    X = vectorizer.fit_transform(corpus)
    
    # We want 12 clusters to find cross-unit hidden patterns
    kmeans = KMeans(n_clusters=12, random_state=42)
    kmeans.fit(X)
    
    labels = kmeans.labels_
    for i, q in enumerate(parsed_data):
        q["ml_cluster_id"] = int(labels[i])
        
    # Find top words per cluster to name them
    order_centroids = kmeans.cluster_centers_.argsort()[:, ::-1]
    terms = vectorizer.get_feature_names_out()
    
    cluster_names = {}
    print("\n[AI Discovered Semantic Clusters]")
    for i in range(12):
        top_words = [terms[ind] for ind in order_centroids[i, :4]]
        cluster_names[i] = " | ".join(top_words)
        print(f"Cluster {i}: {cluster_names[i]}")

    # -----------------------------------------------------------------
    # STAGE 4: TREND ENGINE
    # -----------------------------------------------------------------
    print("\nCalculating Trend Deltas...")
    trend_by_year = {}
    for q in parsed_data:
        yr = q["year"]
        u = q["unit"]
        sub = q["subtopic"]
        if yr not in trend_by_year:
            trend_by_year[yr] = {"units": Counter(), "subtopics": Counter()}
        trend_by_year[yr]["units"][u] += 1
        trend_by_year[yr]["subtopics"][f"{u} -> {sub}"] += 1

    # Save Analytical Report
    with open("scratch/ml_tagged_database.json", "w", encoding="utf-8") as f:
        json.dump(parsed_data, f, indent=2)

    # Build Markdown Dashboard
    years = sorted(trend_by_year.keys())
    with open("scratch/dashboard_report.md", "w", encoding="utf-8") as f:
        f.write("# MPPSC AI Trend Dashboard 📊\n\n")
        f.write("This report analyzes over 268 highly-reliable questions from recent SSE Prelims GS Papers using both Level 2 Taxonomy and Machine Learning Clustering.\n\n")
        
        f.write("## 1. Official Unit Weightage (Aggregated)\n")
        for u, count in unit_distribution.most_common():
            f.write(f"- **{u}**: {count} questions\n")
            
        f.write("\n## 2. Dynamic Year-Over-Year Trends\n")
        if len(years) > 1:
            early_yr = years[0]
            late_yr = years[-1]
            f.write(f"Comparing early dataset ({early_yr}) vs latest dataset ({late_yr}):\n\n")
            for u in unit_distribution.keys():
                count_early = trend_by_year[early_yr]["units"].get(u, 0)
                count_late = trend_by_year[late_yr]["units"].get(u, 0)
                diff = count_late - count_early
                indicator = "🔥 RISING" if diff > 0 else ("📉 FALLING" if diff < 0 else "⚖️ STABLE")
                f.write(f"- **{u}**: {count_early} → {count_late} ({indicator})\n")
        
        f.write("\n## 3. High-Yield Subtopics (The Real Edge)\n")
        total_subtopics = Counter()
        for q in parsed_data:
            if q["subtopic"] != "Unclassified":
                total_subtopics[q["subtopic"]] += 1
                
        for sub, count in total_subtopics.most_common(10):
            f.write(f"- **{sub}**: {count} total appearances\n")

        f.write("\n## 4. AI Discovered Semantic Clusters\n")
        f.write("K-Means clustering algorithm identified the following hidden repetitive patterns regardless of their official Unit:\n")
        for i, name in cluster_names.items():
            count = sum(1 for q in parsed_data if q["ml_cluster_id"] == i)
            f.write(f"- **Cluster {i}** (`{name}`): {count} structural matches.\n")

    print("\nPipeline Complete. Dashboard generated at scratch/dashboard_report.md")

if __name__ == "__main__":
    run_ml_pipeline()
