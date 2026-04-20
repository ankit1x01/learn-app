# MPPSC AI Analytics Engine 
**System Architecture & AI Context Document**

> **AI Instruction Prompt:** If you are an AI assistant reading this file, use this document to understand the codebase structure, the data pipelines, and the technological goals of this project before proceeding with any user requests.

---

## 1. Project Objective
To automate the extraction of Madhya Pradesh Public Service Commission (MPPSC) examination papers, convert raw PDF text into cleanly structured JSON, and apply Machine Learning to cluster repeating question paradigms and predict syllabus weightage trends. Our edge over typical approaches is the use of **Level 2 Sub-topic Taxonomy** combined with **Unsupervised K-Means Semantic Clustering**.

## 2. Directory Structure & Datasets
### Raw File Storage (`/mppsc`)
*   **Format:** `mppsc/[EXAM_CATEGORY]/[STAGE]/[YEAR]/[FILENAME].pdf`
*   **Example:** `mppsc/SSE/prelims/2024/SSE_prelims_2024_paper_i.pdf`
*   **Metadata DB:** `mppsc/metadata.json` (Live catalog updated during fetching)

### Analytical JSON Datasets (`/scratch`)
*   `scratch/master_qbank.json`: The core raw database containing ~300 flawless English MCQs cleanly extracted from 2018-2024 SSE Prelims GS-1. (Fields: `year`, `question_id`, `question`, `options`, `question_type`).
*   `scratch/ml_tagged_database.json`: The ML-augmented database where questions are attached to `unit`, `subtopic`, `matched_keyword`, and `ml_cluster_id`.
*   `scratch/dashboard_report.md`: The final generated time-series trend analysis.

## 3. Core Operational Scripts
Do not modify these scripts without extremely careful consideration of the dependencies:

1.  **`mppsc_fetcher.py`**: The Web Scraper. Uses AJAX pagination on the MPPSC website to download PDFs while skipping identical duplicates and assigning them directly to the hierarchical folders.
2.  **`scratch/mppsc_extractor.py`**: The PDF parser. Uses `pdfplumber` bounding-box logic to sidestep 2-column formatting and regex string manipulation to filter Devanagari text, isolating valid English MCQs.
3.  **`scratch/ml_pipeline.py`**: The Intelligence Core. 
    *   **Phase 1**: Rule-based taxonomy assignment (Unit 1-10 + granular subtopics).
    *   **Phase 2**: NLP Vectorization (`sklearn TfidfVectorizer` mapping string features).
    *   **Phase 3**: Unsupervised Clustering (`sklearn KMeans` mapping structural test patterns across syllabus boundaries).

## 4. Current Constraints & Known Edge Cases
*   **PDF Extraction**: MPPSC papers before 2018 are typically highly degraded scanned image PDFs heavily relying on pure Hindi. `mppsc_extractor.py` intelligently skips processing them rather than polluting the dataset with OCR garbage. The models are trained on the high-fidelity 2018-2024 English extractions.
*   **ML Libraries**: Built strictly using `scikit-learn` to maintain lightweight rapid development. `sentence-transformers` via PyTorch was intentionally delayed to prevent massive local hardware footprint spikes.

## 5. Next Strategic Goals (The Roadmap)
If the user asks to continue work, pick up from one of these three tracks:

1.  **Visual Dashboard (Frontend)**: Consume `ml_tagged_database.json` building a Next.js / React interactive UI to render the historical trends via charts (e.g. Recharts or Chart.js).
2.  **Deep Learning Integration (ML Upgrade)**: Implement embeddings via HuggingFace `sentence-transformers` to replace the `TfidfVectorizer` for hyper-accurate semantic clustering.
3.  **Predictive Matrix (Analytics)**: Add polynomial regression models to forecast the expected MPPSC topic distribution for the 2025 examination mathematically.
