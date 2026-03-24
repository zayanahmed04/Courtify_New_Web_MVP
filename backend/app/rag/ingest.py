import os
import glob
import time
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_pinecone import PineconeVectorStore
from langchain_huggingface import HuggingFaceEmbeddings

# Load environment variables
load_dotenv(override=True)

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "courtify-index")

if not PINECONE_API_KEY:
    raise ValueError("PINECONE_API_KEY not found in .env file")

# Initialize Pinecone
pc = Pinecone(api_key=PINECONE_API_KEY)

# -----------------------
# Load documents
# -----------------------
kb_path = os.path.join(os.path.dirname(__file__), "knowledge_base")
print("Loading documents from knowledge base...")

documents = []

# Recursively load all .md files from knowledge_base and subfolders
for file in glob.glob(os.path.join(kb_path, "**/*.md"), recursive=True):
    loader = TextLoader(file, encoding="utf8")
    docs = loader.load()
    doc_type = os.path.relpath(file, kb_path).split(os.sep)[0]  # top-level folder as doc_type
    for doc in docs:
        doc.metadata["doc_type"] = doc_type
        doc.metadata["source"] = file
        documents.append(doc)
    print(f"Loaded file: {file}")

print(f"Total documents loaded: {len(documents)}")

# -----------------------
# Split documents into chunks
# -----------------------
print("Splitting documents into chunks...")
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)
chunks = text_splitter.split_documents(documents)
print(f"Created {len(chunks)} chunks")

# -----------------------
# Initialize Local HF Embeddings (NO API KEY)
# -----------------------
print("Initializing HuggingFace embeddings...")
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

EMBED_DIM = 384  # HF MiniLM dimension

# -----------------------
# Pinecone index setup
# -----------------------
existing_indexes = [idx.name for idx in pc.list_indexes()]
if PINECONE_INDEX_NAME in existing_indexes:
    print(f"Deleting existing index: {PINECONE_INDEX_NAME}")
    pc.delete_index(PINECONE_INDEX_NAME)
    time.sleep(5)

print(f"Creating new index: {PINECONE_INDEX_NAME}")
pc.create_index(
    name=PINECONE_INDEX_NAME,
    dimension=EMBED_DIM,
    metric="cosine",
    spec=ServerlessSpec(cloud="aws", region="us-east-1")
)

print("Waiting for index to be ready...")
time.sleep(3)

# -----------------------
# Add documents to Pinecone
# -----------------------
print("Adding documents to Pinecone...")
vectorstore = PineconeVectorStore.from_documents(
    documents=chunks,
    embedding=embeddings,
    index_name=PINECONE_INDEX_NAME
)

print("✓ Vector database setup complete!")
print(f"✓ Index name: {PINECONE_INDEX_NAME}")
print(f"✓ Total chunks stored: {len(chunks)}")
