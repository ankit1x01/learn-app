import type { Concept } from '../../core/types';

export const IT_PLACEMENT_CONCEPTS: Concept[] = [

  // ── 📊 Quantitative Aptitude ─────────────────────────────────────

  // Number Systems
  { id: 'q01', name: 'Number System Basics (LCM, HCF)', subject: 'Quantitative Aptitude', chapter: 'Number Systems', unit: 1, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.40, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "LCM and HCF questions appear in every TCS NQT and Wipro NLTH aptitude round — slow calculation here burns time that cascades into failing subsequent questions" },
  { id: 'q02', name: 'Divisibility Rules (2,3,4,5,6,7,8,9,11)', subject: 'Quantitative Aptitude', chapter: 'Number Systems', unit: 1, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.40, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'q03', name: 'Remainders & Modular Arithmetic', subject: 'Quantitative Aptitude', chapter: 'Number Systems', unit: 1, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'q04', name: 'Unit Digit & Cyclicity', subject: 'Quantitative Aptitude', chapter: 'Number Systems', unit: 1, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'q05', name: 'Prime Factorization & Number of Factors', subject: 'Quantitative Aptitude', chapter: 'Number Systems', unit: 1, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Percentages
  { id: 'q06', name: 'Percentage Increase & Decrease', subject: 'Quantitative Aptitude', chapter: 'Percentages', unit: 2, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.35, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Percentage change is the most fundamental aptitude formula — wrong application under time pressure fails banking and fintech first-round assessments", relatedIds: ["q07","q08"] },
  { id: 'q07', name: 'Successive Percentage Change', subject: 'Quantitative Aptitude', chapter: 'Percentages', unit: 2, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.45, lastTested: -1, nextReview: -1 , stakesTier: 1, relatedIds: ["q06","q08"] },
  { id: 'q08', name: 'Percentage to Fraction & Fraction to Percentage', subject: 'Quantitative Aptitude', chapter: 'Percentages', unit: 2, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.30, lastTested: -1, nextReview: -1 , stakesTier: 1, relatedIds: ["q06","q07"] },

  // Profit, Loss & Discount
  { id: 'q09', name: 'Profit & Loss — CP, SP, Markup', subject: 'Quantitative Aptitude', chapter: 'Profit, Loss & Discount', unit: 3, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.40, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Profit and Loss with CP/SP/Markup appears in 80% of Indian IT company aptitude tests — confusing markup and profit percentage fails entire question sets", relatedIds: ["q10","q11"], competingIds: ["q10"], interferenceScore: 0.45 },
  { id: 'q10', name: 'Discount & Marked Price Problems', subject: 'Quantitative Aptitude', chapter: 'Profit, Loss & Discount', unit: 3, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.40, lastTested: -1, nextReview: -1 , stakesTier: 1, relatedIds: ["q09","q11"], competingIds: ["q09"], interferenceScore: 0.45 },
  { id: 'q11', name: 'Dishonest Dealer & False Weights', subject: 'Quantitative Aptitude', chapter: 'Profit, Loss & Discount', unit: 3, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Ratio & Proportion
  { id: 'q12', name: 'Ratio & Proportion — Basic Problems', subject: 'Quantitative Aptitude', chapter: 'Ratio & Proportion', unit: 4, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.35, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'q13', name: 'Partnership Problems', subject: 'Quantitative Aptitude', chapter: 'Ratio & Proportion', unit: 4, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'q14', name: 'Proportion — Direct, Inverse & Joint Variation', subject: 'Quantitative Aptitude', chapter: 'Ratio & Proportion', unit: 4, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.45, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Simple & Compound Interest
  { id: 'q15', name: 'Simple Interest Formula & Problems', subject: 'Quantitative Aptitude', chapter: 'Simple & Compound Interest', unit: 5, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.35, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Simple Interest formula confusion costs 5-10 marks in placement aptitude rounds — wrong answer on a straightforward question signals poor preparation", relatedIds: ["q16","q17"], competingIds: ["q16"], interferenceScore: 0.7 },
  { id: 'q16', name: 'Compound Interest — Annual & Half-Yearly', subject: 'Quantitative Aptitude', chapter: 'Simple & Compound Interest', unit: 5, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.45, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Compound Interest vs Simple Interest distinction is tested in every banking recruitment and IT aptitude round — mixing up formulas fails all CI variants", relatedIds: ["q15","q17"], competingIds: ["q15"], interferenceScore: 0.7 },
  { id: 'q17', name: 'CI vs SI Difference & Effective Rate', subject: 'Quantitative Aptitude', chapter: 'Simple & Compound Interest', unit: 5, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2, relatedIds: ["q15","q16"] },

  // Time, Work & Pipes
  { id: 'q18', name: 'Work & Time — Combined Rates', subject: 'Quantitative Aptitude', chapter: 'Time, Work & Pipes', unit: 6, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.45, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'q19', name: 'Pipes & Cisterns — Fill & Drain', subject: 'Quantitative Aptitude', chapter: 'Time, Work & Pipes', unit: 6, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'q20', name: 'Work — Efficiency & Wages', subject: 'Quantitative Aptitude', chapter: 'Time, Work & Pipes', unit: 6, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'q21', name: 'Men, Days & Hours Problems', subject: 'Quantitative Aptitude', chapter: 'Time, Work & Pipes', unit: 6, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Speed, Distance & Time
  { id: 'q22', name: 'Speed-Distance-Time Formula & Basic Problems', subject: 'Quantitative Aptitude', chapter: 'Speed, Distance & Time', unit: 7, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.40, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Speed-Distance-Time is the most-applied aptitude concept in placement tests — wrong formula under timed pressure cascades into wrong answers for train and boat problems", relatedIds: ["q23","q24"] },
  { id: 'q23', name: 'Relative Speed — Trains & Moving Objects', subject: 'Quantitative Aptitude', chapter: 'Speed, Distance & Time', unit: 7, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Relative speed for trains is a classic trap in Infosys and Wipro assessments — adding vs subtracting speeds for same vs opposite direction is the exact confusion point", relatedIds: ["q22","q24"], competingIds: ["q24"], interferenceScore: 0.5 },
  { id: 'q24', name: 'Boats & Streams — Upstream/Downstream', subject: 'Quantitative Aptitude', chapter: 'Speed, Distance & Time', unit: 7, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1, relatedIds: ["q22","q23"], competingIds: ["q23"], interferenceScore: 0.5 },
  { id: 'q25', name: 'Average Speed & Meeting Point Problems', subject: 'Quantitative Aptitude', chapter: 'Speed, Distance & Time', unit: 7, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Averages
  { id: 'q26', name: 'Average — Basic & Weighted Average', subject: 'Quantitative Aptitude', chapter: 'Averages', unit: 8, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.35, lastTested: -1, nextReview: -1 , stakesTier: 1, relatedIds: ["q27"] },
  { id: 'q27', name: 'Average — Adding/Removing Members', subject: 'Quantitative Aptitude', chapter: 'Averages', unit: 8, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.45, lastTested: -1, nextReview: -1 , stakesTier: 1 },

  // Mixtures & Allegations
  { id: 'q28', name: 'Alligation Rule — Mixing Two Quantities', subject: 'Quantitative Aptitude', chapter: 'Mixtures & Allegations', unit: 9, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'q29', name: 'Mixture Problems — Percentage Concentration', subject: 'Quantitative Aptitude', chapter: 'Mixtures & Allegations', unit: 9, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Permutation & Combination
  { id: 'q30', name: 'Factorial, nPr & nCr Formulas', subject: 'Quantitative Aptitude', chapter: 'Permutation & Combination', unit: 10, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Factorial, nPr and nCr formula confusion is the #1 reason students lose marks in the P&C section — wrong formula selection on a 5-question set loses all 5 marks", relatedIds: ["q31","q32"], competingIds: ["q32"], interferenceScore: 0.65 },
  { id: 'q31', name: 'Arrangements — With & Without Repetition', subject: 'Quantitative Aptitude', chapter: 'Permutation & Combination', unit: 10, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 1, relatedIds: ["q30","q32"] },
  { id: 'q32', name: 'Combinations — Selection Problems', subject: 'Quantitative Aptitude', chapter: 'Permutation & Combination', unit: 10, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 1, relatedIds: ["q30","q31"], competingIds: ["q30"], interferenceScore: 0.65 },
  { id: 'q33', name: 'Circular Permutations & Necklace Problems', subject: 'Quantitative Aptitude', chapter: 'Permutation & Combination', unit: 10, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'q34', name: 'Counting Paths on a Grid', subject: 'Quantitative Aptitude', chapter: 'Permutation & Combination', unit: 10, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Probability
  { id: 'q35', name: 'Basic Probability — Events & Sample Space', subject: 'Quantitative Aptitude', chapter: 'Probability', unit: 11, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Basic probability with sample spaces is asked in every Cognizant, TCS, and Accenture round — wrong sample space enumeration gives plausible-looking wrong answers", relatedIds: ["q36","q38"] },
  { id: 'q36', name: 'Probability — Complementary Events', subject: 'Quantitative Aptitude', chapter: 'Probability', unit: 11, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.45, lastTested: -1, nextReview: -1 , stakesTier: 1, relatedIds: ["q35","q38"] },
  { id: 'q37', name: 'Conditional Probability & Bayes Theorem (basics)', subject: 'Quantitative Aptitude', chapter: 'Probability', unit: 11, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'q38', name: 'Probability — Cards, Coins & Dice Problems', subject: 'Quantitative Aptitude', chapter: 'Probability', unit: 11, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1, relatedIds: ["q35","q36"] },

  // Algebra & Equations
  { id: 'q39', name: 'Linear Equations — Word Problems', subject: 'Quantitative Aptitude', chapter: 'Algebra & Equations', unit: 12, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.45, lastTested: -1, nextReview: -1 , stakesTier: 1, relatedIds: ["q41"] },
  { id: 'q40', name: 'Quadratic Equations — Roots & Discriminant', subject: 'Quantitative Aptitude', chapter: 'Algebra & Equations', unit: 12, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'q41', name: 'Simultaneous Equations — 2 Variables', subject: 'Quantitative Aptitude', chapter: 'Algebra & Equations', unit: 12, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.45, lastTested: -1, nextReview: -1 , stakesTier: 1, relatedIds: ["q39"] },
  { id: 'q42', name: 'Inequalities & Number Line', subject: 'Quantitative Aptitude', chapter: 'Algebra & Equations', unit: 12, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Geometry & Mensuration
  { id: 'q43', name: 'Area & Perimeter — 2D Shapes', subject: 'Quantitative Aptitude', chapter: 'Geometry & Mensuration', unit: 13, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.40, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'q44', name: 'Volume & Surface Area — 3D Shapes', subject: 'Quantitative Aptitude', chapter: 'Geometry & Mensuration', unit: 13, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'q45', name: 'Circles — Chord, Arc, Sector & Tangent', subject: 'Quantitative Aptitude', chapter: 'Geometry & Mensuration', unit: 13, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'q46', name: 'Triangles — Properties, Similar & Congruent', subject: 'Quantitative Aptitude', chapter: 'Geometry & Mensuration', unit: 13, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Clocks & Calendars
  { id: 'q47', name: 'Clock Angle Problems', subject: 'Quantitative Aptitude', chapter: 'Clocks & Calendars', unit: 14, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'q48', name: 'Calendar — Day of the Week Problems', subject: 'Quantitative Aptitude', chapter: 'Clocks & Calendars', unit: 14, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'q49', name: 'Leap Year Rules & Odd Days', subject: 'Quantitative Aptitude', chapter: 'Clocks & Calendars', unit: 14, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.45, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Data Interpretation
  { id: 'q50', name: 'Bar Chart & Line Graph Interpretation', subject: 'Quantitative Aptitude', chapter: 'Data Interpretation', unit: 15, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'q51', name: 'Pie Chart — Percentage & Degree', subject: 'Quantitative Aptitude', chapter: 'Data Interpretation', unit: 15, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'q52', name: 'Table DI — Ratio, % Change & Comparison', subject: 'Quantitative Aptitude', chapter: 'Data Interpretation', unit: 15, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'q53', name: 'Mixed DI — Caselet & Two-chart Sets', subject: 'Quantitative Aptitude', chapter: 'Data Interpretation', unit: 15, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Logical Reasoning
  { id: 'q54', name: 'Series Completion — Number & Letter', subject: 'Quantitative Aptitude', chapter: 'Logical Reasoning', unit: 16, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.45, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'q55', name: 'Coding-Decoding — Letter Shift & Pattern', subject: 'Quantitative Aptitude', chapter: 'Logical Reasoning', unit: 16, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'q56', name: 'Blood Relations — Family Tree', subject: 'Quantitative Aptitude', chapter: 'Logical Reasoning', unit: 16, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'q57', name: 'Seating Arrangement — Linear & Circular', subject: 'Quantitative Aptitude', chapter: 'Logical Reasoning', unit: 16, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Seating arrangement problems are timed at 2 minutes each in placement tests — slow table setup means you run out of time and score zero on the entire set" },
  { id: 'q58', name: 'Direction & Distance Problems', subject: 'Quantitative Aptitude', chapter: 'Logical Reasoning', unit: 16, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'q59', name: 'Ranking & Ordering', subject: 'Quantitative Aptitude', chapter: 'Logical Reasoning', unit: 16, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.45, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'q60', name: 'Syllogisms — All, Some, No Statements', subject: 'Quantitative Aptitude', chapter: 'Logical Reasoning', unit: 16, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Syllogisms with All/Some/No quantifiers are given 8 minutes for 5 questions in TCS Ninja — missing the contrapositive rule fails every 'some' conclusion question" },
  { id: 'q61', name: 'Statement & Assumptions / Conclusions', subject: 'Quantitative Aptitude', chapter: 'Logical Reasoning', unit: 16, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'q62', name: 'Analogy — Word & Number Pairs', subject: 'Quantitative Aptitude', chapter: 'Logical Reasoning', unit: 16, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.45, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'q63', name: 'Input-Output Machine Problems', subject: 'Quantitative Aptitude', chapter: 'Logical Reasoning', unit: 16, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'q64', name: 'Venn Diagrams — Set Membership Problems', subject: 'Quantitative Aptitude', chapter: 'Logical Reasoning', unit: 16, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'q65', name: 'Cube & Dice — Face & Orientation', subject: 'Quantitative Aptitude', chapter: 'Logical Reasoning', unit: 16, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // ── 📝 English & Communication ──────────────────────────────────

  // Reading Comprehension
  { id: 'e01', name: 'RC — Identifying Main Idea & Title', subject: 'English & Communication', chapter: 'Reading Comprehension', unit: 1, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.45, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Reading comprehension carries 20-25 marks in every IT placement test — wrong main idea identification cascades into wrong answers on all 4-5 sub-questions" },
  { id: 'e02', name: 'RC — Factual & Inference Questions', subject: 'English & Communication', chapter: 'Reading Comprehension', unit: 1, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'e03', name: 'RC — Author\'s Tone & Attitude', subject: 'English & Communication', chapter: 'Reading Comprehension', unit: 1, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'e04', name: 'RC — Vocabulary in Context', subject: 'English & Communication', chapter: 'Reading Comprehension', unit: 1, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'e05', name: 'RC — True/False/Not Given Strategy', subject: 'English & Communication', chapter: 'Reading Comprehension', unit: 1, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1 },

  // Grammar
  { id: 'e06', name: 'Subject-Verb Agreement Rules', subject: 'English & Communication', chapter: 'Grammar', unit: 2, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.45, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Subject-verb agreement errors are the most common reason for low English scores in Accenture and Capgemini assessments — one rule violation flags weak grammar fundamentals" },
  { id: 'e07', name: 'Tense Usage — Simple, Perfect & Continuous', subject: 'English & Communication', chapter: 'Grammar', unit: 2, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Tense errors in error-spotting are the most frequent grammar question type — wrong perfect continuous vs simple past identification loses clusters of marks" },
  { id: 'e08', name: 'Articles — A, An, The (Zero Article)', subject: 'English & Communication', chapter: 'Grammar', unit: 2, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.45, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'e09', name: 'Prepositions — In, On, At, Of, For, With', subject: 'English & Communication', chapter: 'Grammar', unit: 2, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'e10', name: 'Modals — Can, Could, Should, Must, Would', subject: 'English & Communication', chapter: 'Grammar', unit: 2, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'e11', name: 'Active vs Passive Voice Conversion', subject: 'English & Communication', chapter: 'Grammar', unit: 2, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'e12', name: 'Direct & Indirect Speech (Reported Speech)', subject: 'English & Communication', chapter: 'Grammar', unit: 2, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'e13', name: 'Conjunctions & Compound Sentences', subject: 'English & Communication', chapter: 'Grammar', unit: 2, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.45, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Error Spotting & Sentence Correction
  { id: 'e14', name: 'Error Spotting — Common Grammar Errors', subject: 'English & Communication', chapter: 'Error Spotting & Correction', unit: 3, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Error spotting in TCS Digital and Infosys Specialist rounds gives 10 questions with negative marking — each wrong answer subtracts 0.33 marks from your score" },
  { id: 'e15', name: 'Sentence Improvement — Better Phrasing', subject: 'English & Communication', chapter: 'Error Spotting & Correction', unit: 3, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'e16', name: 'Double Errors — Tense + Agreement Combined', subject: 'English & Communication', chapter: 'Error Spotting & Correction', unit: 3, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Vocabulary
  { id: 'e17', name: 'Synonyms & Antonyms — High-Freq Words', subject: 'English & Communication', chapter: 'Vocabulary', unit: 4, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'e18', name: 'Idioms & Phrases — Common Set', subject: 'English & Communication', chapter: 'Vocabulary', unit: 4, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'e19', name: 'Word Roots — Prefixes & Suffixes', subject: 'English & Communication', chapter: 'Vocabulary', unit: 4, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'e20', name: 'One Word Substitution', subject: 'English & Communication', chapter: 'Vocabulary', unit: 4, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'e21', name: 'Confusables — Accept/Except, Affect/Effect', subject: 'English & Communication', chapter: 'Vocabulary', unit: 4, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Para-Jumbles & Cloze
  { id: 'e22', name: 'Para-Jumbles — 4-Sentence Reordering', subject: 'English & Communication', chapter: 'Para-Jumbles & Cloze', unit: 5, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Para-jumbles appear in every major IT placement test — wrong ordering on a 5-sentence set gives zero marks for the entire question regardless of partial correctness" },
  { id: 'e23', name: 'Para-Jumbles — Topic/Concluding Sentence', subject: 'English & Communication', chapter: 'Para-Jumbles & Cloze', unit: 5, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'e24', name: 'Cloze Test — Single Blank (MCQ)', subject: 'English & Communication', chapter: 'Para-Jumbles & Cloze', unit: 5, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'e25', name: 'Cloze Test — Paragraph (5-6 blanks)', subject: 'English & Communication', chapter: 'Para-Jumbles & Cloze', unit: 5, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Writing Skills
  { id: 'e26', name: 'Essay Writing — Structure & Intro/Conclusion', subject: 'English & Communication', chapter: 'Writing Skills', unit: 6, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'e27', name: 'Essay: Technology & Society Topics', subject: 'English & Communication', chapter: 'Writing Skills', unit: 6, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'e28', name: 'Short Paragraph — 100 Words in 10 Minutes', subject: 'English & Communication', chapter: 'Writing Skills', unit: 6, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Fill in the Blanks
  { id: 'e29', name: 'Fill in the Blank — Contextual Vocabulary', subject: 'English & Communication', chapter: 'Fill in the Blanks', unit: 7, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'e30', name: 'Double Blanks — Grammar + Vocabulary', subject: 'English & Communication', chapter: 'Fill in the Blanks', unit: 7, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // ── 💻 DSA & Coding ────────────────────────────────────────────

  // Arrays & Strings
  { id: 'c01', name: 'Two-Pointer — Pair Sum & Three Sum', subject: 'DSA & Coding', chapter: 'Arrays & Strings', unit: 1, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Two-Pointer pattern solves 30% of array interview questions — not recognising the trigger when a problem says 'sorted array and target sum' loses you FAANG-level offers", relatedIds: ["c02","c06"], competingIds: ["c02"], interferenceScore: 0.5 },
  { id: 'c02', name: 'Sliding Window — Fixed & Variable Size', subject: 'DSA & Coding', chapter: 'Arrays & Strings', unit: 1, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Variable Sliding Window is the O(n) answer interviewers expect — submitting O(n²) nested loops signals you never studied the pattern and gets your resume rejected", relatedIds: ["c01","c09"], competingIds: ["c01"], interferenceScore: 0.5 },
  { id: 'c03', name: 'Kadane\'s Algorithm — Maximum Subarray Sum', subject: 'DSA & Coding', chapter: 'Arrays & Strings', unit: 1, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Maximum subarray sum has appeared in Google, Amazon, Microsoft, and TCS Digital every year — blank mind on Kadane's Algorithm ends the coding round immediately", relatedIds: ["c04","c08"], competingIds: ["c04"], interferenceScore: 0.35 },
  { id: 'c04', name: 'Prefix Sum — Range Queries', subject: 'DSA & Coding', chapter: 'Arrays & Strings', unit: 1, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.45, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Prefix sum makes range queries O(1) after O(n) build — database query optimisation interviews at Oracle and SAP always test this thinking", relatedIds: ["c03"], competingIds: ["c03"], interferenceScore: 0.35 },
  { id: 'c05', name: 'Binary Search — Classic & On Answers', subject: 'DSA & Coding', chapter: 'Arrays & Strings', unit: 1, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Off-by-one in Binary Search boundary conditions is the #1 reason candidates fail on-site rounds after clearing the phone screen — wrong lo/hi update causes infinite loops" },
  { id: 'c06', name: 'Dutch National Flag — Sort 0s, 1s, 2s', subject: 'DSA & Coding', chapter: 'Arrays & Strings', unit: 1, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.45, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Dutch National Flag appears in Infosys mass hiring drives every year — O(n) three-pointer or brute force O(n²) is the exact filter question" },
  { id: 'c07', name: 'Rotate Array — Left & Right by K', subject: 'DSA & Coding', chapter: 'Arrays & Strings', unit: 1, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.45, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Array rotation in-place using reversal trick is O(n) O(1) space — extra-array copy solution shows you haven't studied in-place techniques" },
  { id: 'c08', name: 'Stock Buy/Sell — Max Profit', subject: 'DSA & Coding', chapter: 'Arrays & Strings', unit: 1, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.45, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Stock Buy Sell in one greedy pass appears as the opener in Amazon coding rounds — solving it in O(n) vs O(n²) reveals whether you see the greedy structure", relatedIds: ["c03"] },
  { id: 'c09', name: 'Longest Substring Without Repeating Characters', subject: 'DSA & Coding', chapter: 'Arrays & Strings', unit: 1, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Longest Substring Without Repeating Characters is the canonical sliding window string problem — wrong window expansion logic gives TLE on every large input", relatedIds: ["c02"] },
  { id: 'c10', name: 'Anagram Check & Group Anagrams', subject: 'DSA & Coding', chapter: 'Arrays & Strings', unit: 1, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Anagram detection using frequency maps is asked at Accenture and Capgemini in-person rounds — sorting-based O(n log n) solution versus O(n) hash map is the key question" },
  { id: 'c11', name: 'Matrix Rotation by 90 Degrees', subject: 'DSA & Coding', chapter: 'Arrays & Strings', unit: 1, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'c12', name: 'Spiral Matrix Traversal', subject: 'DSA & Coding', chapter: 'Arrays & Strings', unit: 1, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'c13', name: 'Next Permutation', subject: 'DSA & Coding', chapter: 'Arrays & Strings', unit: 1, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Linked Lists
  { id: 'c14', name: 'Reverse Linked List — Iterative & Recursive', subject: 'DSA & Coding', chapter: 'Linked Lists', unit: 2, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.45, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Reverse Linked List is the most-asked linked list question globally — recursion vs iteration trade-off plus space complexity is the standard follow-up", relatedIds: ["c15","c16"] },
  { id: 'c15', name: 'Cycle Detection — Floyd\'s Tortoise & Hare', subject: 'DSA & Coding', chapter: 'Linked Lists', unit: 2, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Floyd's Cycle Detection runs in O(n) O(1) space — hash set solution exists but interviewers always ask for the two-pointer version as the optimal answer", relatedIds: ["c14"] },
  { id: 'c16', name: 'Merge Two Sorted Linked Lists', subject: 'DSA & Coding', chapter: 'Linked Lists', unit: 2, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Merge Two Sorted Lists is used in Merge Sort and in database join implementations — wrong pointer handling corrupts the list and fails test cases silently", relatedIds: ["c14","c17"] },
  { id: 'c17', name: 'Remove Nth Node from End', subject: 'DSA & Coding', chapter: 'Linked Lists', unit: 2, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Remove Nth Node From End using two-pointer in one pass is a clean interview question — two-pass solution works but signals you haven't practised the pattern", relatedIds: ["c16"] },
  { id: 'c18', name: 'Palindrome Linked List Check', subject: 'DSA & Coding', chapter: 'Linked Lists', unit: 2, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'c19', name: 'Intersection of Two Linked Lists', subject: 'DSA & Coding', chapter: 'Linked Lists', unit: 2, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Stacks & Queues
  { id: 'c20', name: 'Balanced Parentheses Checker', subject: 'DSA & Coding', chapter: 'Stacks & Queues', unit: 3, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.40, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Balanced Parentheses using a stack is the most-asked stack question in placement tests — wrong pop order fails all nested cases" },
  { id: 'c21', name: 'Next Greater Element (Monotonic Stack)', subject: 'DSA & Coding', chapter: 'Stacks & Queues', unit: 3, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Next Greater Element with monotonic stack reduces O(n²) brute force to O(n) — this exact problem appeared in Paytm and PhonePe coding rounds in 2024" },
  { id: 'c22', name: 'Sliding Window Maximum (Deque)', subject: 'DSA & Coding', chapter: 'Stacks & Queues', unit: 3, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'c23', name: 'Evaluate Reverse Polish Notation', subject: 'DSA & Coding', chapter: 'Stacks & Queues', unit: 3, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'c24', name: 'Implement Stack using Queue & Vice Versa', subject: 'DSA & Coding', chapter: 'Stacks & Queues', unit: 3, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'c25', name: 'LRU Cache Implementation', subject: 'DSA & Coding', chapter: 'Stacks & Queues', unit: 3, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.70, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Trees
  { id: 'c26', name: 'Binary Tree — Inorder, Preorder, Postorder', subject: 'DSA & Coding', chapter: 'Trees', unit: 4, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.45, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Binary Tree traversal orders are the first question every tree interview starts with — confusing pre/in/post signals you studied names not mechanisms", relatedIds: ["c27","c28"], competingIds: ["c27"], interferenceScore: 0.35 },
  { id: 'c27', name: 'Level Order Traversal (BFS on Tree)', subject: 'DSA & Coding', chapter: 'Trees', unit: 4, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Level Order BFS traversal is the foundation of every graph shortest-path algorithm — not knowing it means you cannot implement Dijkstra or Prim's from scratch", relatedIds: ["c26","c35"], competingIds: ["c26"], interferenceScore: 0.35 },
  { id: 'c28', name: 'Height & Diameter of Binary Tree', subject: 'DSA & Coding', chapter: 'Trees', unit: 4, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Tree height and diameter in a single DFS pass is asked to separate O(n) thinkers from O(n²) thinkers — two-pass solution loses points at senior level", relatedIds: ["c26","c30"] },
  { id: 'c29', name: 'Lowest Common Ancestor in BT & BST', subject: 'DSA & Coding', chapter: 'Trees', unit: 4, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Lowest Common Ancestor in BST vs Binary Tree are two different problems — interviewers at Google and Flipkart ask both back-to-back to test your understanding", relatedIds: ["c31"] },
  { id: 'c30', name: 'Check Balanced Binary Tree', subject: 'DSA & Coding', chapter: 'Trees', unit: 4, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 1, relatedIds: ["c28"] },
  { id: 'c31', name: 'BST — Search, Insert & Delete', subject: 'DSA & Coding', chapter: 'Trees', unit: 4, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "BST insertion and deletion are asked because wrong parent-pointer updates corrupt the structure — every database B-tree implementation relies on this logic", relatedIds: ["c29"] },
  { id: 'c32', name: 'Right/Left View, Top/Bottom View of BT', subject: 'DSA & Coding', chapter: 'Trees', unit: 4, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'c33', name: 'Path Sum — Root to Leaf', subject: 'DSA & Coding', chapter: 'Trees', unit: 4, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'c34', name: 'Maximum Path Sum in Binary Tree', subject: 'DSA & Coding', chapter: 'Trees', unit: 4, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.70, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Graphs
  { id: 'c35', name: 'BFS — Level Traversal & Shortest Path (Unweighted)', subject: 'DSA & Coding', chapter: 'Graphs', unit: 5, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "BFS gives shortest path in unweighted graphs — using DFS here gives a wrong answer that looks plausible and wastes 20 minutes of your interview", relatedIds: ["c36","c27"], competingIds: ["c36"], interferenceScore: 0.6 },
  { id: 'c36', name: 'DFS — Connected Components & Cycle Detection', subject: 'DSA & Coding', chapter: 'Graphs', unit: 5, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "DFS with cycle detection and connected components is the base of topological sort — wrong visited-state handling gives wrong cycle detection results", relatedIds: ["c35","c37"], competingIds: ["c35"], interferenceScore: 0.6 },
  { id: 'c37', name: 'Topological Sort (BFS / DFS)', subject: 'DSA & Coding', chapter: 'Graphs', unit: 5, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Topological Sort using Kahn's BFS algorithm is asked in every system design adjacent coding round — wrong ordering breaks build systems and task schedulers", relatedIds: ["c36","c38"] },
  { id: 'c38', name: 'Number of Islands / Connected Regions', subject: 'DSA & Coding', chapter: 'Graphs', unit: 5, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Number of Islands using BFS/DFS on a grid is the most-asked graph interview question at product companies — missing the visited-marking logic gives wrong count", relatedIds: ["c35","c36"] },
  { id: 'c39', name: 'Dijkstra\'s Algorithm — Shortest Path Weighted', subject: 'DSA & Coding', chapter: 'Graphs', unit: 5, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.70, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'c40', name: 'Bipartite Graph Check', subject: 'DSA & Coding', chapter: 'Graphs', unit: 5, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Sorting & Searching
  { id: 'c41', name: 'Merge Sort — Implementation & Complexity', subject: 'DSA & Coding', chapter: 'Sorting & Searching', unit: 6, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Merge Sort stability and O(n log n) worst case are tested at SDE-2 level — confusing its complexity with Quick Sort's average case fails a classic comparison question", relatedIds: ["c42"], competingIds: ["c42"], interferenceScore: 0.5 },
  { id: 'c42', name: 'Quick Sort — Partition & Pivot Selection', subject: 'DSA & Coding', chapter: 'Sorting & Searching', unit: 6, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Quick Sort with wrong pivot choice gives O(n²) worst case on sorted arrays — this is why production systems use randomised Quick Sort or Introsort", relatedIds: ["c41"], competingIds: ["c41"], interferenceScore: 0.5 },
  { id: 'c43', name: 'Counting Sort & Radix Sort', subject: 'DSA & Coding', chapter: 'Sorting & Searching', unit: 6, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'c44', name: 'Binary Search on 2D Matrix', subject: 'DSA & Coding', chapter: 'Sorting & Searching', unit: 6, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'c45', name: 'Kth Largest Element — QuickSelect & Heap', subject: 'DSA & Coding', chapter: 'Sorting & Searching', unit: 6, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Dynamic Programming
  { id: 'c46', name: 'Fibonacci — Memoization vs Tabulation', subject: 'DSA & Coding', chapter: 'Dynamic Programming', unit: 7, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.45, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Fibonacci with memoisation vs tabulation is the gateway DP question — not explaining the overlapping subproblems concept means you will fail every subsequent DP problem", relatedIds: ["c47","c48"] },
  { id: 'c47', name: 'Climbing Stairs / Unique Paths', subject: 'DSA & Coding', chapter: 'Dynamic Programming', unit: 7, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Climbing Stairs is asked in 60% of placement tests as the DP warm-up — wrong recurrence relation means you are building an array but not understanding DP", relatedIds: ["c46","c48"] },
  { id: 'c48', name: 'Unique Paths with Obstacles (2D DP)', subject: 'DSA & Coding', chapter: 'Dynamic Programming', unit: 7, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 1, relatedIds: ["c47","c49"] },
  { id: 'c49', name: '0/1 Knapsack Problem', subject: 'DSA & Coding', chapter: 'Dynamic Programming', unit: 7, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "0/1 Knapsack is the template for Subset Sum, Partition Equal Subset Sum, and Target Sum — not knowing it cold means you cannot recognise the DP pattern in disguise", relatedIds: ["c50","c48"], competingIds: ["c50"], interferenceScore: 0.4 },
  { id: 'c50', name: 'Coin Change — Minimum Coins & Number of Ways', subject: 'DSA & Coding', chapter: 'Dynamic Programming', unit: 7, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Coin Change minimum coins problem is asked in fintech companies because it maps to payment denomination problems — greedy fails on certain coin sets; knowing why is the question", relatedIds: ["c49"], competingIds: ["c49"], interferenceScore: 0.4 },
  { id: 'c51', name: 'Longest Common Subsequence (LCS)', subject: 'DSA & Coding', chapter: 'Dynamic Programming', unit: 7, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'c52', name: 'Longest Increasing Subsequence (LIS)', subject: 'DSA & Coding', chapter: 'Dynamic Programming', unit: 7, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'c53', name: 'Edit Distance (Levenshtein)', subject: 'DSA & Coding', chapter: 'Dynamic Programming', unit: 7, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.70, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'c54', name: 'Subset Sum & Partition Equal Subset', subject: 'DSA & Coding', chapter: 'Dynamic Programming', unit: 7, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'c55', name: 'House Robber I & II', subject: 'DSA & Coding', chapter: 'Dynamic Programming', unit: 7, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Heaps & Priority Queue
  { id: 'c56', name: 'Heap — Min/Max Heap Operations', subject: 'DSA & Coding', chapter: 'Heaps & Priority Queue', unit: 8, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'c57', name: 'Merge K Sorted Lists using Min-Heap', subject: 'DSA & Coding', chapter: 'Heaps & Priority Queue', unit: 8, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.70, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'c58', name: 'Find Median from Data Stream', subject: 'DSA & Coding', chapter: 'Heaps & Priority Queue', unit: 8, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.75, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'c59', name: 'Top K Frequent Elements', subject: 'DSA & Coding', chapter: 'Heaps & Priority Queue', unit: 8, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Greedy
  { id: 'c60', name: 'Activity Selection / N Meetings in One Room', subject: 'DSA & Coding', chapter: 'Greedy Algorithms', unit: 9, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'c61', name: 'Minimum Meeting Rooms (Interval Scheduling)', subject: 'DSA & Coding', chapter: 'Greedy Algorithms', unit: 9, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'c62', name: 'Jump Game I & II', subject: 'DSA & Coding', chapter: 'Greedy Algorithms', unit: 9, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'c63', name: 'Fractional Knapsack', subject: 'DSA & Coding', chapter: 'Greedy Algorithms', unit: 9, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Hashing & Maps
  { id: 'c64', name: 'Two Sum — HashMap O(n) Approach', subject: 'DSA & Coding', chapter: 'Hashing & Maps', unit: 10, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.40, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'c65', name: 'Frequency Count & Most Frequent Element', subject: 'DSA & Coding', chapter: 'Hashing & Maps', unit: 10, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.40, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'c66', name: 'Subarray with Sum K (Prefix Sum + HashMap)', subject: 'DSA & Coding', chapter: 'Hashing & Maps', unit: 10, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'c67', name: 'Longest Consecutive Sequence', subject: 'DSA & Coding', chapter: 'Hashing & Maps', unit: 10, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Bit Manipulation
  { id: 'c68', name: 'Bit Tricks — XOR, AND, OR, Shift', subject: 'DSA & Coding', chapter: 'Bit Manipulation', unit: 11, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'c69', name: 'Single Number — XOR Trick', subject: 'DSA & Coding', chapter: 'Bit Manipulation', unit: 11, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'c70', name: 'Count Set Bits (Brian Kernighan\'s Algorithm)', subject: 'DSA & Coding', chapter: 'Bit Manipulation', unit: 11, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'c71', name: 'Power of 2 Check — Bit Trick', subject: 'DSA & Coding', chapter: 'Bit Manipulation', unit: 11, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.45, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Complexity Analysis
  { id: 'c72', name: 'Time Complexity — Big-O Analysis', subject: 'DSA & Coding', chapter: 'Complexity Analysis', unit: 12, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.45, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'c73', name: 'Space Complexity & In-Place Algorithms', subject: 'DSA & Coding', chapter: 'Complexity Analysis', unit: 12, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.45, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'c74', name: 'Recursion — Call Stack & Recurrence Relations', subject: 'DSA & Coding', chapter: 'Complexity Analysis', unit: 12, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'c75', name: 'Amortized Analysis — ArrayList & Hash Table', subject: 'DSA & Coding', chapter: 'Complexity Analysis', unit: 12, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },


  // ── 🗄️ Databases & SQL ─────────────────────────────────────────

  // SQL Basics
  { id: 'db01', name: 'SELECT, WHERE, ORDER BY, LIMIT', subject: 'Databases & SQL', chapter: 'SQL Basics', unit: 1, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.35, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "SELECT with WHERE and ORDER BY is the first SQL screen question at every company — unable to write a basic query live signals you have never used SQL in practice", relatedIds: ["db02","db03","db04"] },
  { id: 'db02', name: 'INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN', subject: 'Databases & SQL', chapter: 'SQL Basics', unit: 1, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "LEFT JOIN vs INNER JOIN distinction is the most-failed SQL interview question — wrong join type silently drops rows and gives plausible but incorrect results", relatedIds: ["db01","db07","db08"], competingIds: ["db08"], interferenceScore: 0.4 },
  { id: 'db03', name: 'GROUP BY & HAVING Clause', subject: 'Databases & SQL', chapter: 'SQL Basics', unit: 1, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "GROUP BY with HAVING filters aggregate results — confusing WHERE with HAVING is the classic SQL error that interviewers use to filter candidates who copy-paste queries", relatedIds: ["db01","db04"] },
  { id: 'db04', name: 'Aggregate Functions — COUNT, SUM, AVG, MAX, MIN', subject: 'Databases & SQL', chapter: 'SQL Basics', unit: 1, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.40, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Aggregate functions COUNT vs SUM vs AVG are asked in every database technical round — wrong function on a NULL-containing column gives surprising results that you must explain", relatedIds: ["db03"] },
  { id: 'db05', name: 'Subqueries — Correlated & Non-Correlated', subject: 'Databases & SQL', chapter: 'SQL Basics', unit: 1, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'db06', name: 'Window Functions — ROW_NUMBER, RANK, DENSE_RANK', subject: 'Databases & SQL', chapter: 'SQL Basics', unit: 1, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'db07', name: 'DISTINCT, UNION, INTERSECT, EXCEPT', subject: 'Databases & SQL', chapter: 'SQL Basics', unit: 1, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'db08', name: 'Self Join & Cross Join', subject: 'Databases & SQL', chapter: 'SQL Basics', unit: 1, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2, competingIds: ["db02"], interferenceScore: 0.4 },

  // Normalization
  { id: 'db09', name: '1NF, 2NF, 3NF — Definitions & Examples', subject: 'Databases & SQL', chapter: 'Normalization', unit: 2, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "1NF 2NF 3NF normalisation is asked in every campus placement technical interview — inability to spot partial and transitive dependencies signals you studied definitions not reasoning", relatedIds: ["db10","db11"], competingIds: ["db10"], interferenceScore: 0.5 },
  { id: 'db10', name: 'BCNF & Denormalization Trade-offs', subject: 'Databases & SQL', chapter: 'Normalization', unit: 2, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 2, relatedIds: ["db09"], competingIds: ["db09"], interferenceScore: 0.5 },
  { id: 'db11', name: 'Functional Dependencies & Keys (Primary, Candidate, Foreign)', subject: 'Databases & SQL', chapter: 'Normalization', unit: 2, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Primary, Candidate, and Foreign Key distinctions plus functional dependencies are the basis of all schema design questions — wrong definition fails every ERD design question", relatedIds: ["db09"] },

  // Indexing & Query Optimization
  { id: 'db12', name: 'Index Types — B-Tree vs Hash Index', subject: 'Databases & SQL', chapter: 'Indexing', unit: 3, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'db13', name: 'Clustered vs Non-Clustered Index', subject: 'Databases & SQL', chapter: 'Indexing', unit: 3, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'db14', name: 'Query Optimization — EXPLAIN & Execution Plan', subject: 'Databases & SQL', chapter: 'Indexing', unit: 3, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Transactions
  { id: 'db15', name: 'ACID Properties — Atomicity, Consistency, Isolation, Durability', subject: 'Databases & SQL', chapter: 'Transactions', unit: 4, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "ACID properties are asked in every backend and database interview — not being able to give a real example for each property signals you memorised acronyms without understanding", relatedIds: ["db16","db17","db18"], competingIds: ["db16"], interferenceScore: 0.45 },
  { id: 'db16', name: 'Isolation Levels — Read Uncommitted to Serializable', subject: 'Databases & SQL', chapter: 'Transactions', unit: 4, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 2, relatedIds: ["db15","db17"], competingIds: ["db15"], interferenceScore: 0.45 },
  { id: 'db17', name: 'Optimistic vs Pessimistic Locking', subject: 'Databases & SQL', chapter: 'Transactions', unit: 4, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 2, relatedIds: ["db15","db16"] },
  { id: 'db18', name: 'Deadlock in Databases — Detection & Prevention', subject: 'Databases & SQL', chapter: 'Transactions', unit: 4, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // NoSQL
  { id: 'db19', name: 'NoSQL Types — Key-Value, Document, Columnar, Graph', subject: 'Databases & SQL', chapter: 'NoSQL Basics', unit: 5, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'db20', name: 'MongoDB — CRUD Operations & Schema Design', subject: 'Databases & SQL', chapter: 'NoSQL Basics', unit: 5, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'db21', name: 'CAP Theorem — Consistency, Availability, Partition Tolerance', subject: 'Databases & SQL', chapter: 'NoSQL Basics', unit: 5, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'db22', name: 'SQL vs NoSQL — When to Use Which?', subject: 'Databases & SQL', chapter: 'NoSQL Basics', unit: 5, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "SQL vs NoSQL trade-off question appears in 70% of system design interviews at product companies — wrong choice for a use case signals you cannot make architectural decisions" },

  // ── 🖥️ Core CS — OS & Networking ─────────────────────────────

  // Processes & Threads
  { id: 'os01', name: 'Process vs Thread — Differences & Use Cases', subject: 'Core CS — OS & Networks', chapter: 'Processes & Threads', unit: 1, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Process vs Thread distinction is the first OS question in every campus placement technical round — wrong memory isolation answer reveals you studied the surface definition only", relatedIds: ["os02","os04"], competingIds: ["os02"], interferenceScore: 0.4 },
  { id: 'os02', name: 'Context Switching — How & When', subject: 'Core CS — OS & Networks', chapter: 'Processes & Threads', unit: 1, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Context switching overhead is why Go uses goroutines and Node uses event loops — not understanding this means you cannot explain why concurrency models differ", relatedIds: ["os01"], competingIds: ["os01"], interferenceScore: 0.4 },
  { id: 'os03', name: 'Inter-Process Communication — Pipes, Sockets, Shared Memory', subject: 'Core CS — OS & Networks', chapter: 'Processes & Threads', unit: 1, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'os04', name: 'Process States — New, Ready, Running, Waiting, Terminated', subject: 'Core CS — OS & Networks', chapter: 'Processes & Threads', unit: 1, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.45, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Process state machine with Ready, Running, Waiting transitions is asked in TCS and Infosys technical rounds — drawing wrong transitions fails all scheduling follow-up questions", relatedIds: ["os01","os05"] },

  // CPU Scheduling
  { id: 'os05', name: 'FCFS, SJF, Round Robin — Gantt Chart & Waiting Time', subject: 'Core CS — OS & Networks', chapter: 'CPU Scheduling', unit: 2, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "FCFS vs SJF vs Round Robin Gantt chart calculation is the standard OS numerical question in campus placements — wrong waiting time calculation loses all marks on the numerical set", relatedIds: ["os06"], competingIds: ["os06"], interferenceScore: 0.45 },
  { id: 'os06', name: 'Priority Scheduling — Preemptive & Non-Preemptive', subject: 'Core CS — OS & Networks', chapter: 'CPU Scheduling', unit: 2, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2, relatedIds: ["os05"], competingIds: ["os05"], interferenceScore: 0.45 },
  { id: 'os07', name: 'Multilevel Queue & Feedback Queue Scheduling', subject: 'Core CS — OS & Networks', chapter: 'CPU Scheduling', unit: 2, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Memory Management
  { id: 'os08', name: 'Paging — Page Table, TLB, Address Translation', subject: 'Core CS — OS & Networks', chapter: 'Memory Management', unit: 3, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Paging with TLB and address translation is asked at companies building systems software — unable to calculate physical address from virtual address fails every OS numerical" },
  { id: 'os09', name: 'Segmentation vs Paging', subject: 'Core CS — OS & Networks', chapter: 'Memory Management', unit: 3, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'os10', name: 'Virtual Memory & Demand Paging', subject: 'Core CS — OS & Networks', chapter: 'Memory Management', unit: 3, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'os11', name: 'Page Replacement — LRU, FIFO, Optimal', subject: 'Core CS — OS & Networks', chapter: 'Memory Management', unit: 3, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'os12', name: 'Thrashing & Working Set Model', subject: 'Core CS — OS & Networks', chapter: 'Memory Management', unit: 3, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Deadlocks
  { id: 'os13', name: 'Deadlock — 4 Necessary Conditions (Coffman)', subject: 'Core CS — OS & Networks', chapter: 'Deadlocks', unit: 4, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'os14', name: 'Deadlock Prevention vs Avoidance vs Detection', subject: 'Core CS — OS & Networks', chapter: 'Deadlocks', unit: 4, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'os15', name: 'Banker\'s Algorithm — Safe State Check', subject: 'Core CS — OS & Networks', chapter: 'Deadlocks', unit: 4, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.70, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Synchronization
  { id: 'os16', name: 'Mutex & Semaphore — Difference & Usage', subject: 'Core CS — OS & Networks', chapter: 'Synchronization', unit: 5, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'os17', name: 'Race Condition & Critical Section Problem', subject: 'Core CS — OS & Networks', chapter: 'Synchronization', unit: 5, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'os18', name: 'Producer-Consumer Problem', subject: 'Core CS — OS & Networks', chapter: 'Synchronization', unit: 5, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Networking
  { id: 'os19', name: 'OSI 7-Layer Model — Layer Names & Roles', subject: 'Core CS — OS & Networks', chapter: 'Networking Basics', unit: 6, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'os20', name: 'TCP vs UDP — Features & Use Cases', subject: 'Core CS — OS & Networks', chapter: 'Networking Basics', unit: 6, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'os21', name: 'TCP Three-Way Handshake (SYN, SYN-ACK, ACK)', subject: 'Core CS — OS & Networks', chapter: 'Networking Basics', unit: 6, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.45, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'os22', name: 'DNS Resolution Flow — Browser to IP', subject: 'Core CS — OS & Networks', chapter: 'Networking Basics', unit: 6, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'os23', name: 'HTTP/HTTPS — Methods, Status Codes, Headers', subject: 'Core CS — OS & Networks', chapter: 'Networking Basics', unit: 6, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'os24', name: 'IP Addressing — IPv4, Subnetting, CIDR basics', subject: 'Core CS — OS & Networks', chapter: 'Networking Basics', unit: 6, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'os25', name: 'How a Web Browser Fetches a Page (Full Flow)', subject: 'Core CS — OS & Networks', chapter: 'Networking Basics', unit: 6, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'os26', name: 'Sockets — TCP Server/Client Model', subject: 'Core CS — OS & Networks', chapter: 'Networking Basics', unit: 6, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // ── 🧩 OOP & Programming ─────────────────────────────────────

  // OOP Principles
  { id: 'oo01', name: 'Encapsulation — Access Modifiers & Getters/Setters', subject: 'OOP & Programming', chapter: 'OOP Principles', unit: 1, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.40, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Encapsulation vs Abstraction is the most confused OOP question — mixing up hiding implementation from hiding data fails every Java and Python OOP interview at service companies", relatedIds: ["oo03","oo02"], competingIds: ["oo03"], interferenceScore: 0.55 },
  { id: 'oo02', name: 'Inheritance — Single, Multi-level, Hierarchical', subject: 'OOP & Programming', chapter: 'OOP Principles', unit: 1, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.45, lastTested: -1, nextReview: -1 , stakesTier: 1, relatedIds: ["oo01","oo06"], competingIds: ["oo06"], interferenceScore: 0.45 },
  { id: 'oo03', name: 'Polymorphism — Overloading vs Overriding', subject: 'OOP & Programming', chapter: 'OOP Principles', unit: 1, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Polymorphism with compile-time vs runtime distinction is asked in every Java role interview — wrong overloading vs overriding example signals you know OOP vocabulary but not mechanics", relatedIds: ["oo01"], competingIds: ["oo01"], interferenceScore: 0.55 },
  { id: 'oo04', name: 'Abstraction — Abstract Classes vs Interfaces', subject: 'OOP & Programming', chapter: 'OOP Principles', unit: 1, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'oo05', name: 'SOLID Principles — Overview', subject: 'OOP & Programming', chapter: 'OOP Principles', unit: 1, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Design Patterns
  { id: 'oo06', name: 'Singleton Pattern — Thread-Safe Implementation', subject: 'OOP & Programming', chapter: 'Design Patterns', unit: 2, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 1, stakesFact: "Inheritance vs Composition trade-off is the most important OOP design principle — always choosing inheritance over composition is the classic mistake that gets you rejected at senior level", relatedIds: ["oo02"], competingIds: ["oo02"], interferenceScore: 0.45 },
  { id: 'oo07', name: 'Factory & Abstract Factory Pattern', subject: 'OOP & Programming', chapter: 'Design Patterns', unit: 2, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'oo08', name: 'Observer Pattern — Event-Driven Systems', subject: 'OOP & Programming', chapter: 'Design Patterns', unit: 2, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'oo09', name: 'Builder & Decorator Patterns', subject: 'OOP & Programming', chapter: 'Design Patterns', unit: 2, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Java / Language Specifics
  { id: 'oo10', name: 'Java vs C++ — Memory Management & Pointers', subject: 'OOP & Programming', chapter: 'Languages', unit: 3, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'oo11', name: 'Java Collections — List, Set, Map, Queue', subject: 'OOP & Programming', chapter: 'Languages', unit: 3, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'oo12', name: 'Python — List Comprehension, Generators, Decorators', subject: 'OOP & Programming', chapter: 'Languages', unit: 3, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'oo13', name: 'Exception Handling — try/catch/finally, Custom Exceptions', subject: 'OOP & Programming', chapter: 'Languages', unit: 3, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.45, lastTested: -1, nextReview: -1 , stakesTier: 1 },

  // Memory & Concurrency
  { id: 'oo14', name: 'Stack vs Heap — Variable Allocation', subject: 'OOP & Programming', chapter: 'Memory & Concurrency', unit: 4, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'oo15', name: 'Garbage Collection — How GC Works (Java/Python)', subject: 'OOP & Programming', chapter: 'Memory & Concurrency', unit: 4, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'oo16', name: 'Memory Leaks — Causes & Detection in C++/Java', subject: 'OOP & Programming', chapter: 'Memory & Concurrency', unit: 4, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'oo17', name: 'Thread Safety — Synchronized Blocks & volatile', subject: 'OOP & Programming', chapter: 'Memory & Concurrency', unit: 4, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Compiler Basics
  { id: 'oo18', name: 'Compiler Phases — Lexing, Parsing, Code Gen', subject: 'OOP & Programming', chapter: 'Compiler Basics', unit: 5, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'oo19', name: 'Interpreter vs Compiler vs JIT', subject: 'OOP & Programming', chapter: 'Compiler Basics', unit: 5, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // ── 🏗️ System Design ─────────────────────────────────────────

  // Architecture
  { id: 'sd01', name: 'Monolith vs Microservices — Trade-offs', subject: 'System Design', chapter: 'Architecture', unit: 1, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'sd02', name: 'Horizontal vs Vertical Scaling', subject: 'System Design', chapter: 'Architecture', unit: 1, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'sd03', name: 'Load Balancer — Round Robin, Sticky Sessions, L4/L7', subject: 'System Design', chapter: 'Architecture', unit: 1, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'sd04', name: 'CDN — Content Delivery Networks & Edge Caching', subject: 'System Design', chapter: 'Architecture', unit: 1, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Caching
  { id: 'sd05', name: 'Caching Strategies — Write-Through, Write-Back, Cache-Aside', subject: 'System Design', chapter: 'Caching', unit: 2, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'sd06', name: 'Redis — Data Structures & Common Use Cases', subject: 'System Design', chapter: 'Caching', unit: 2, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'sd07', name: 'Cache Invalidation — TTL, LRU Eviction', subject: 'System Design', chapter: 'Caching', unit: 2, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Database Scaling
  { id: 'sd08', name: 'Database Sharding — Horizontal Partitioning', subject: 'System Design', chapter: 'Database Scaling', unit: 3, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.70, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'sd09', name: 'Master-Slave Replication — Read Replicas', subject: 'System Design', chapter: 'Database Scaling', unit: 3, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Messaging & Rate Limiting
  { id: 'sd10', name: 'Message Queues — Kafka, RabbitMQ, Pub/Sub Model', subject: 'System Design', chapter: 'Messaging', unit: 4, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'sd11', name: 'Rate Limiting — Token Bucket & Sliding Window', subject: 'System Design', chapter: 'Messaging', unit: 4, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Case Studies
  { id: 'sd12', name: 'Design: URL Shortener (API, DB, Hashing, Cache)', subject: 'System Design', chapter: 'Case Studies', unit: 5, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.70, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'sd13', name: 'Design: Chat Application (WebSockets, Pub/Sub, Sharding)', subject: 'System Design', chapter: 'Case Studies', unit: 5, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.75, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'sd14', name: 'Design: Social Media Feed (Fan-out, Timeline, Cache)', subject: 'System Design', chapter: 'Case Studies', unit: 5, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.75, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'sd15', name: 'Design: File Storage Service (S3-like — Chunking, CDN)', subject: 'System Design', chapter: 'Case Studies', unit: 5, pyqTier: 3, stage: 'Unseen', stability: 0, difficulty: 0.80, lastTested: -1, nextReview: -1 , stakesTier: 3 },

  // ── 🤖 Domain Topics ─────────────────────────────────────────

  // AI / ML Basics
  { id: 'dm01', name: 'Supervised vs Unsupervised vs Reinforcement Learning', subject: 'Domain Topics', chapter: 'AI & ML Basics', unit: 1, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'dm02', name: 'Linear Regression — MSE, Gradient Descent', subject: 'Domain Topics', chapter: 'AI & ML Basics', unit: 1, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'dm03', name: 'Logistic Regression & Classification Metrics', subject: 'Domain Topics', chapter: 'AI & ML Basics', unit: 1, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'dm04', name: 'Decision Trees & Random Forests — Gini, Entropy', subject: 'Domain Topics', chapter: 'AI & ML Basics', unit: 1, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'dm05', name: 'Overfitting vs Underfitting — Bias-Variance Trade-off', subject: 'Domain Topics', chapter: 'AI & ML Basics', unit: 1, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'dm06', name: 'Confusion Matrix — Precision, Recall, F1-Score', subject: 'Domain Topics', chapter: 'AI & ML Basics', unit: 1, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'dm07', name: 'Neural Networks — Layers, Activation Functions (basics)', subject: 'Domain Topics', chapter: 'AI & ML Basics', unit: 1, pyqTier: 3, stage: 'Unseen', stability: 0, difficulty: 0.70, lastTested: -1, nextReview: -1 , stakesTier: 3 },

  // Web Development Basics
  { id: 'dm08', name: 'REST API — Methods (GET/POST/PUT/DELETE), Status Codes', subject: 'Domain Topics', chapter: 'Web Development', unit: 2, pyqTier: 1, stage: 'Unseen', stability: 0, difficulty: 0.45, lastTested: -1, nextReview: -1 , stakesTier: 1 },
  { id: 'dm09', name: 'JWT vs OAuth 2.0 — Authentication & Authorization', subject: 'Domain Topics', chapter: 'Web Development', unit: 2, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'dm10', name: 'Frontend vs Backend — How React talks to Node.js/Python', subject: 'Domain Topics', chapter: 'Web Development', unit: 2, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.50, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'dm11', name: 'Session Management — Cookies, Tokens, LocalStorage', subject: 'Domain Topics', chapter: 'Web Development', unit: 2, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },

  // Cloud Basics
  { id: 'dm12', name: 'AWS Core Services — S3, EC2, RDS, Lambda, IAM', subject: 'Domain Topics', chapter: 'Cloud & DevOps', unit: 3, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'dm13', name: 'Serverless vs Containers (Lambda vs Docker/K8s)', subject: 'Domain Topics', chapter: 'Cloud & DevOps', unit: 3, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.65, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'dm14', name: 'CI/CD Pipeline — Build, Test, Deploy Stages', subject: 'Domain Topics', chapter: 'Cloud & DevOps', unit: 3, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'dm15', name: 'Azure & GCP — Key Services Overview', subject: 'Domain Topics', chapter: 'Cloud & DevOps', unit: 3, pyqTier: 3, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 3 },

  // Security Basics
  { id: 'dm16', name: 'SSL/TLS — Handshake & Certificate Chain', subject: 'Domain Topics', chapter: 'Security Basics', unit: 4, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'dm17', name: 'Hashing vs Encryption — MD5, SHA-256, AES', subject: 'Domain Topics', chapter: 'Security Basics', unit: 4, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.55, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'dm18', name: 'OWASP Top 10 — SQL Injection, XSS, CSRF', subject: 'Domain Topics', chapter: 'Security Basics', unit: 4, pyqTier: 2, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 2 },
  { id: 'dm19', name: 'Password Security — Salting & Bcrypt Hashing', subject: 'Domain Topics', chapter: 'Security Basics', unit: 4, pyqTier: 3, stage: 'Unseen', stability: 0, difficulty: 0.60, lastTested: -1, nextReview: -1 , stakesTier: 3 },

];
