from sentence_transformers import SentenceTransformer
import numpy as np

# Load a pre-trained multilingual model for generating semantic vector representations
model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")


def generate_embedding(text: str):
    """
    Converts input text into a high-dimensional vector (embedding)
    to enable semantic search and personalized recommendations
    """

    if not text:
        return None

    # Generate a numerical representation of the text's meaning
    embedding = model.encode(text)

    return embedding.tolist()
