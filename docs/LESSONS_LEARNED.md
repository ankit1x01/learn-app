# Lessons Learned & Engineering Anti-Patterns
*A post-mortem analysis of the MPPSC AI Analytics project.*

This document captures the key software engineering mistakes made during the initial development phases of this project, how the architecture was corrected, and the core principles you should apply to future projects to ensure production-grade reliability.

---

## 1. The "Two-Step Data Pipeline" Trap
*   **The Mistake:** We initially downloaded all PDFs into a chaotic flat directory (`docs/exams/mppsc/question papers/`) and then wrote a separate script (`mppsc_restructure.py`) to systematically read, rename, and sort them into final folders.
*   **Why It Failed:** This created fragile, disconnected systems. If the first script downloaded an unexpected format or crashed, the second script broke immediately. It required multiple manual executions.
*   **The Solution:** We combined both scripts into the Unified Engine (`mppsc_fetcher.py`), forcing categorization to happen dynamically *before* the file hits the disk.
*   **Golden Rule:** Clean, categorize, and structure your data at the exact moment of ingestion. Never store raw, dirty data locally if you can avoid it.

## 2. Trusting Upstream Data Sources
*   **The Mistake:** We assumed the MPPSC website administrators followed consistent naming conventions (e.g., that Mains exams would always explicitly mention "Mains" in the title). We also assumed they would not upload duplicate links. 
*   **Why It Failed:** When MPPSC lazily called later exams "Paper-I", our script threw them into a junk `na` (Not Applicable) folder. Furthermore, MPPSC had exact duplicate links for the 2020 examination which caused redundant downloading.
*   **The Solution:** We implemented **Defensive Fallbacks**. We added structural inference (e.g., *if exam == State Service and title contains "Paper", infer "Mains"*). We also added an idempotent path-checking layer that ignores duplicates dynamically.
*   **Golden Rule:** Never trust an external API or website to hand you perfectly formatted data. Build your systems assuming the upstream provider will make typographical errors and duplicate entries.

## 3. Hardcoding UI/Pixel Boundaries (Fragile Scraping)
*   **The Mistake:** To solve the 2-column English/Hindi PDF layout, we initially tried to mathematically slice the PDF exactly down the middle (`w/2`) using geometric bounding boxes.
*   **Why It Failed:** When faced with differently formatted papers (like the 2015-2017 papers) or single-column documents, the script mathematical bounds destroyed the text layers, extracting 0 valid questions.
*   **The Solution:** We removed pixel-based scraping and instead relied on native semantic layout preservation, coupled with deep Regex (`\d+\.\s`) to search for structural text markers inherently tied to the questions.
*   **Golden Rule:** Never rely on precise visual locations (CSS pixel coordinates or bounding boxes) when extracting data. If the UI changes by 10 pixels, your scraper breaks. Extract based on semantic structure.

## 4. Rushing to Machine Learning (Garbage In, Garbage Out)
*   **The Mistake:** Preparing the Machine Learning architecture (K-means clustering, TF-IDF vectorization) before the actual extraction algorithms were solid.
*   **Why It Failed:** Had we fed the shattered string extractions from the failed PDF bounds into the `scikit-learn` models, the unsupervised AI clustering would have confidently categorized gibberish. 
*   **The Solution:** We stalled the ML pipeline deployment and spent 90% of our effort rigorously refining the Regex to isolate purely English text into `master_qbank.json`. Once the dataset was perfectly pristine, the ML algorithms completed flawlessly and autonomously discovered highly accurate paradigms (e.g., the "Civil Rights Act" clusters).
*   **Golden Rule:** 95% of Machine Learning and Artificial Intelligence is simply data-cleansing. Never deploy AI on dirty infrastructure; invest your time in the parsers.
