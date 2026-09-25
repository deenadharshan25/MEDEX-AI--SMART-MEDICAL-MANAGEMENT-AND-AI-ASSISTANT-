"""
MediAI — RAG (Retrieval-Augmented Generation) & Knowledge Base Service
Provides similarity search over medical guidelines, disease protocols, and drug interactions.
"""

import math
import re
import os
from typing import List, Dict, Any

MEDICAL_KNOWLEDGE_BASE = [
    {
        "id": "kb-001",
        "category": "Cardiology",
        "title": "Hypertension Guidelines & Blood Pressure Management",
        "content": (
            "Normal blood pressure is under 120/80 mmHg. Stage 1 hypertension is 130-139/80-89 mmHg. "
            "Stage 2 hypertension is >=140/90 mmHg. Management includes DASH diet (low sodium <2300mg/day), "
            "regular aerobic exercise 150 min/week, weight reduction, and medications like ACE inhibitors, "
            "ARBs, calcium channel blockers (e.g., Amlodipine 5mg), or thiazide diuretics."
        ),
        "tags": ["blood pressure", "hypertension", "amlodipine", "vitals", "heart"]
    },
    {
        "id": "kb-002",
        "category": "Endocrinology",
        "title": "Type 2 Diabetes Management & Blood Glucose Standards",
        "content": (
            "Fasting blood glucose normal range is 70-99 mg/dL. Prediabetes: 100-125 mg/dL. "
            "Diabetes diagnosis: Fasting glucose >= 126 mg/dL or HbA1c >= 6.5%. First-line therapy is "
            "Metformin (500mg-1000mg twice daily with meals). Dietary guidelines emphasize low Glycemic Index (GI) "
            "carbohydrates, fiber intake (>30g/day), avoiding sugary drinks, and monitoring blood glucose post-prandially."
        ),
        "tags": ["diabetes", "glucose", "metformin", "hba1c", "blood sugar", "diet"]
    },
    {
        "id": "kb-003",
        "category": "Neurology",
        "title": "Headache Triaging: Tension, Migraine, and Red Flags",
        "content": (
            "Tension headaches present with bilateral band-like tightness, managed with rest, hydration, and OTC analgesics. "
            "Migraines present with unilateral throbbing pain, photophobia, and nausea, managed with triptans or NSAIDs. "
            "RED FLAGS requiring emergency care: Sudden 'thunderclap' headache, fever with stiff neck, focal neurological deficits, "
            "or headache following head trauma."
        ),
        "tags": ["headache", "migraine", "dizziness", "pain", "triaging", "red flags"]
    },
    {
        "id": "kb-004",
        "category": "Infectious Diseases",
        "title": "Fever & Respiratory Illness Protocols",
        "content": (
            "Fever is defined as body temperature > 100.4°F (38°C). Management includes hydration, acetaminophen (500-1000mg q6h), "
            "or ibuprofen (400mg q6h). High fever (>103°F / 39.4°C), persistent shortness of breath, chest pain, or cough with "
            "discolored sputum warrants immediate physical medical evaluation."
        ),
        "tags": ["fever", "cough", "flu", "temperature", "infection", "respiratory"]
    },
    {
        "id": "kb-005",
        "category": "Pharmacology",
        "title": "Common Drug Interactions & Safety Guidelines",
        "content": (
            "NSAIDs (Ibuprofen, Naproxen) should be avoided or used cautiously in patients with severe hypertension, "
            "kidney disease, or taking ACE inhibitors. Metformin requires renal function monitoring (eGFR). "
            "Always report allergies (e.g., Penicillin) before starting antibiotic courses."
        ),
        "tags": ["medication", "prescriptions", "drugs", "interactions", "allergies", "safety"]
    },
    {
        "id": "kb-006",
        "category": "Preventative Health",
        "title": "BMI Standards & Cardiovascular Risk Factors",
        "content": (
            "Body Mass Index (BMI) categories: Underweight < 18.5, Normal 18.5-24.9, Overweight 25-29.9, Obese >= 30. "
            "Key cardiovascular risk factors include elevated LDL cholesterol (>100 mg/dL), smoking, physical inactivity, "
            "and chronic stress. 150 minutes of moderate exercise weekly reduces risk by up to 30%."
        ),
        "tags": ["bmi", "weight", "obesity", "cardiovascular", "exercise", "vitals"]
    }
]

def _tokenize(text: str) -> List[str]:
    """Tokenize and normalize text into lowercase terms."""
    return re.findall(r'\b\w+\b', text.lower())

def _tf_idf_similarity(query_tokens: List[str], doc_tokens: List[str]) -> float:
    """Compute lexical TF-IDF style similarity score."""
    if not query_tokens or not doc_tokens:
        return 0.0
    query_set = set(query_tokens)
    doc_set = set(doc_tokens)
    intersection = query_set.intersection(doc_set)
    if not intersection:
        return 0.0
    
    score = sum(1.0 for token in intersection if len(token) > 2)
    norm = math.sqrt(len(query_set)) * math.sqrt(len(doc_set))
    return (score / norm) if norm > 0 else 0.0

class RAGService:
    def __init__(self):
        self.kb = MEDICAL_KNOWLEDGE_BASE
        for doc in self.kb:
            doc["_tokens"] = _tokenize(doc["title"] + " " + doc["content"] + " " + " ".join(doc["tags"]))

    def search_knowledge_base(self, query: str, top_k: int = 2) -> List[Dict[str, Any]]:
        """Retrieve top_k matching medical documents for RAG context."""
        query_tokens = _tokenize(query)
        scored_docs = []
        
        for doc in self.kb:
            score = _tf_idf_similarity(query_tokens, doc["_tokens"])
            for tag in doc["tags"]:
                if tag in query.lower():
                    score += 0.5
            scored_docs.append((score, doc))
            
        scored_docs.sort(key=lambda x: x[0], reverse=True)
        results = [doc for score, doc in scored_docs if score > 0.1][:top_k]
        
        if not results:
            results = [self.kb[0], self.kb[1]]
            
        return results

    def build_rag_prompt_context(self, query: str) -> str:
        """Build formatted RAG grounding block to inject into LLM system prompt."""
        docs = self.search_knowledge_base(query, top_k=2)
        context_str = "📚 [RETRIEVED MEDICAL KNOWLEDGE BASE CONTEXT]\n"
        for idx, d in enumerate(docs, 1):
            context_str += f"{idx}. {d['title']} ({d['category']}):\n   \"{d['content']}\"\n"
        return context_str

rag_service = RAGService()
