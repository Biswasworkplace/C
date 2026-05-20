const medicinalData = [
  { part: "Part I", title: "Introduction to Medicinal Chemistry", chapters: [
    { num: "1", title: "Fundamentals of Medicinal Chemistry", subs: ["Definition and Scope","History and Development of Drugs","Drug Discovery Process","Lead Identification and Optimization","Pharmacodynamics and Pharmacokinetics","Structure-Activity Relationship (SAR)","Pharmacophore Concept","Drug Metabolism and Biotransformation","Prodrugs and Soft Drugs","Drug Design Approaches"] }
  ]},
  { part: "Part II", title: "Autonomic Nervous System Drugs", chapters: [
    { num: "2", title: "Cholinergic Drugs", subs: ["Cholinergic Agonists","Anticholinesterase Agents","Cholinergic Blocking Agents","Neuromuscular Blocking Agents"] },
    { num: "3", title: "Adrenergic Drugs", subs: ["Adrenergic Agonists","Alpha Blockers","Beta Blockers","Adrenergic Neuron Blocking Agents"] }
  ]},
  { part: "Part III", title: "Central Nervous System Drugs", chapters: [
    { num: "4", title: "Sedatives and Hypnotics", subs: ["Barbiturates","Benzodiazepines","Non-Benzodiazepine Hypnotics"] },
    { num: "5", title: "Antipsychotic Drugs", subs: ["Typical Antipsychotics","Atypical Antipsychotics"] },
    { num: "6", title: "Antidepressants", subs: ["Tricyclic Antidepressants","SSRIs","SNRIs","MAO Inhibitors","Atypical Antidepressants"] },
    { num: "7", title: "Antiepileptic Drugs", subs: ["Sodium Channel Blockers","GABA Enhancers","Calcium Channel Modulators"] },
    { num: "8", title: "Opioid Analgesics", subs: ["Natural Opioids","Semisynthetic Opioids","Synthetic Opioids","Opioid Antagonists"] },
    { num: "9", title: "Non-Opioid Analgesics", subs: ["NSAIDs","COX-2 Inhibitors","Antipyretics"] },
    { num: "10", title: "General and Local Anesthetics", subs: ["Inhalational Anesthetics","Intravenous Anesthetics","Ester Local Anesthetics","Amide Local Anesthetics"] },
    { num: "11", title: "Anti-Parkinsonian Drugs", subs: ["Dopamine Precursors","Dopamine Agonists","MAO-B Inhibitors","COMT Inhibitors"] },
    { num: "12", title: "Anti-Alzheimer Drugs", subs: ["Cholinesterase Inhibitors","NMDA Receptor Antagonists"] }
  ]},
  { part: "Part IV", title: "Cardiovascular Drugs", chapters: [
    { num: "13", title: "Antihypertensive Drugs", subs: ["ACE Inhibitors","ARBs","Calcium Channel Blockers","Diuretics","Beta Blockers","Vasodilators"] },
    { num: "14", title: "Antianginal Drugs", subs: ["Organic Nitrates","Calcium Channel Blockers","Potassium Channel Activators"] },
    { num: "15", title: "Antiarrhythmic Drugs", subs: ["Sodium Channel Blockers","Beta Blockers","Potassium Channel Blockers","Calcium Channel Blockers"] },
    { num: "16", title: "Antihyperlipidemic Drugs", subs: ["Statins","Fibrates","Bile Acid Sequestrants","Cholesterol Absorption Inhibitors"] },
    { num: "17", title: "Anticoagulants and Antiplatelet Drugs", subs: ["Heparins","Vitamin K Antagonists","Direct Oral Anticoagulants","Antiplatelet Agents","Thrombolytics"] },
    { num: "18", title: "Congestive Heart Failure Drugs", subs: ["Cardiac Glycosides","Inotropes","ARNI Drugs"] }
  ]},
  { part: "Part V", title: "Endocrine System Drugs", chapters: [
    { num: "19", title: "Antidiabetic Drugs", subs: ["Insulin Preparations","Sulfonylureas","Biguanides","DPP-4 Inhibitors","GLP-1 Agonists","SGLT2 Inhibitors"] },
    { num: "20", title: "Thyroid and Antithyroid Drugs", subs: ["Thyroid Hormones","Thioamides","Iodine Preparations"] },
    { num: "21", title: "Steroidal Drugs", subs: ["Corticosteroids","Androgens","Estrogens","Progestins","Anabolic Steroids"] },
    { num: "22", title: "Oral Contraceptives", subs: ["Combined Pills","Progesterone-Only Pills","Emergency Contraceptives"] }
  ]},
  { part: "Part VI", title: "Respiratory System Drugs", chapters: [
    { num: "23", title: "Antiasthmatic Drugs", subs: ["Beta-2 Agonists","Corticosteroids","Leukotriene Antagonists","Methylxanthines"] },
    { num: "24", title: "Antitussives and Expectorants", subs: ["Opioid Antitussives","Non-Opioid Antitussives","Mucolytics","Expectorants"] },
    { num: "25", title: "Antihistamines", subs: ["First Generation Antihistamines","Second Generation Antihistamines"] }
  ]},
  { part: "Part VII", title: "Gastrointestinal Drugs", chapters: [
    { num: "26", title: "Antiulcer Drugs", subs: ["Proton Pump Inhibitors","H2 Receptor Blockers","Antacids","Cytoprotective Agents"] },
    { num: "27", title: "Antiemetic Drugs", subs: ["Dopamine Antagonists","5-HT3 Antagonists","NK1 Antagonists"] },
    { num: "28", title: "Laxatives and Antidiarrheal Drugs", subs: ["Bulk Forming Agents","Osmotic Laxatives","Stimulant Laxatives","Antimotility Agents"] }
  ]},
  { part: "Part VIII", title: "Anti-Infective Agents", chapters: [
    { num: "29", title: "Antibacterial Drugs", subs: ["Beta-Lactam Antibiotics","Aminoglycosides","Tetracyclines","Macrolides","Fluoroquinolones","Sulfonamides","Glycopeptides"] },
    { num: "30", title: "Antitubercular Drugs", subs: ["First-Line Drugs","Second-Line Drugs"] },
    { num: "31", title: "Antileprotic Drugs", subs: [] },
    { num: "32", title: "Antifungal Drugs", subs: ["Polyenes","Azoles","Echinocandins"] },
    { num: "33", title: "Antiviral Drugs", subs: ["Anti-HIV Drugs","Anti-Herpes Drugs","Anti-Influenza Drugs","Anti-Hepatitis Drugs"] },
    { num: "34", title: "Antimalarial Drugs", subs: ["Quinoline Derivatives","Artemisinin Derivatives"] },
    { num: "35", title: "Antiamoebic and Antiprotozoal Drugs", subs: [] },
    { num: "36", title: "Anthelmintic Drugs", subs: [] }
  ]},
  { part: "Part IX", title: "Anticancer and Immunological Drugs", chapters: [
    { num: "37", title: "Anticancer Drugs", subs: ["Alkylating Agents","Antimetabolites","Natural Product Anticancer Drugs","Hormonal Anticancer Drugs","Targeted Anticancer Therapy","Monoclonal Antibodies","Immunotherapy"] },
    { num: "38", title: "Immunosuppressants", subs: ["Calcineurin Inhibitors","mTOR Inhibitors","Cytotoxic Immunosuppressants"] },
    { num: "39", title: "Immunostimulants and Vaccines", subs: [] }
  ]},
  { part: "Part X", title: "Chemotherapeutic Agents", chapters: [
    { num: "40", title: "Antiseptics and Disinfectants", subs: [] },
    { num: "41", title: "Chelating Agents", subs: [] },
    { num: "42", title: "Diagnostic Agents and Contrast Media", subs: [] }
  ]},
  { part: "Part XI", title: "Vitamins and Nutritional Agents", chapters: [
    { num: "43", title: "Vitamins", subs: ["Fat Soluble Vitamins","Water Soluble Vitamins"] },
    { num: "44", title: "Hematinics", subs: ["Iron Preparations","Folic Acid","Vitamin B12"] },
    { num: "45", title: "Electrolyte and Fluid Replacement Therapy", subs: [] }
  ]},
  { part: "Part XII", title: "Advanced and Modern Therapeutics", chapters: [
    { num: "46", title: "Biotechnology Derived Drugs", subs: ["Recombinant Proteins","Monoclonal Antibodies","Gene Therapy"] },
    { num: "47", title: "Peptide and Protein Drugs", subs: [] },
    { num: "48", title: "Nanomedicine and Targeted Drug Delivery", subs: [] },
    { num: "49", title: "Personalized Medicine and Pharmacogenomics", subs: [] },
    { num: "50", title: "Recent Advances in Medicinal Chemistry", subs: ["AI in Drug Design","PROTACs","CRISPR Therapeutics","RNA-Based Drugs","Antibody Drug Conjugates (ADCs)"] }
  ]}
];
