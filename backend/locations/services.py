from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")


def generate_embedding(text: str):

    if not text:
        return None

    embedding = model.encode(text)

    return embedding.tolist()
