import logging

from sentence_transformers import SentenceTransformer

logger = logging.getLogger(__name__)

# Load a pre-trained multilingual model for generating semantic vector representations
# model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")
model = SentenceTransformer("paraphrase-multilingual-MiniLM-L3-v2")


def generate_embedding(text: str):
    """
    Converts input text into a high-dimensional vector (embedding)
    to enable semantic search and personalized recommendations
    """

    if not text:
        return None

    # Generate a numerical representation of the text's meaning
    try:
        embedding = model.encode(text)
        return embedding.tolist()

    except Exception:
        logger.exception("Failed to generate embedding")
        return None
